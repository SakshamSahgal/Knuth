const path = require("path");
const crypto = require("crypto");
const { readDB, writeDB, updateDB, deleteDB } = require("../MongoOperations.js");
const { isLoggedIn, updateLastActivity, isCoordinator } = require("../Middlewares.js");
const { updateLog } = require("../Admin/UserActivty.js");

module.exports = (app) => {

    // Render the registrations timeline and active forms
    app.get("/registrations", isLoggedIn, updateLastActivity, async (req, res) => {
        try {
            updateLog(req, "Accessed the registrations page");
            const email = req.user.emails[0].value;

            // Fetch coordinators to determine authorization state
            const coordinators = await readDB("Main", "Coordinators", { "list.gmail": email });
            const coordinator = coordinators.length > 0;

            // Fetch all registration forms (both active and past)
            const forms = await readDB("Main", "RegistrationForms", {});
            
            // Sort forms by creation date descending
            forms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            res.render(path.join(__dirname, "..", "..", "ClientSide", "Forms", "Registrations.ejs"), {
                page: "registrations",
                emailTo: email,
                forms,
                coordinator
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error fetching registrations data");
        }
    });

    // API to create a new registration form (Coordinator only)
    app.post("/api/create-registration-form", isLoggedIn, isCoordinator, updateLastActivity, async (req, res) => {
        const titleRaw = req.body?.title;
        const descriptionRaw = req.body?.description;
        const deadlineRaw = req.body?.deadline;

        if (typeof titleRaw !== "string" || typeof descriptionRaw !== "string" || typeof deadlineRaw !== "string") {
            return res.status(400).json({ success: false, error: "Title, description, and deadline must be strings." });
        }

        const title = titleRaw.trim();
        const description = descriptionRaw.trim();
        const deadlineStr = deadlineRaw.trim();

        if (!title || !description || !deadlineStr) {
            return res.status(400).json({ success: false, error: "All fields are required." });
        }

        const deadlineDate = new Date(deadlineStr);
        if (isNaN(deadlineDate.getTime())) {
            return res.status(400).json({ success: false, error: "Invalid deadline date format." });
        }

        if (deadlineDate <= new Date()) {
            return res.status(400).json({ success: false, error: "Deadline must be in the future." });
        }

        try {
            const formId = crypto.randomUUID();
            const newForm = {
                id: formId,
                title,
                description,
                deadline: deadlineDate.toISOString(),
                createdAt: new Date().toISOString(),
                createdBy: req.user.emails[0].value,
                registrants: []
            };

            await writeDB("Main", "RegistrationForms", newForm);
            updateLog(req, "Created registration form: " + title);

            res.json({ success: true, message: "Registration form created successfully!" });
        } catch (err) {
            res.json({ success: false, error: err.message });
        }
    });

    // API to delete a registration form (Coordinator only)
    app.post("/api/delete-registration-form", isLoggedIn, isCoordinator, updateLastActivity, async (req, res) => {
        const formIdRaw = req.body?.formId;
        if (typeof formIdRaw !== "string") {
            return res.status(400).json({ success: false, error: "formId must be a string." });
        }
        const formId = formIdRaw.trim();
        if (!formId) {
            return res.status(400).json({ success: false, error: "formId is required." });
        }

        try {
            // Find form first to log the title
            const forms = await readDB("Main", "RegistrationForms", { id: formId });
            if (forms.length === 0) {
                return res.status(404).json({ success: false, error: "Registration form not found." });
            }

            await deleteDB("Main", "RegistrationForms", { id: formId });
            updateLog(req, "Deleted registration form: " + forms[0].title);

            res.json({ success: true, message: "Registration form deleted successfully!" });
        } catch (err) {
            res.json({ success: false, error: err.message });
        }
    });

    // API to register a user for an event (Logged-in users only)
    app.post("/api/register-event", isLoggedIn, updateLastActivity, async (req, res) => {
        // Debounce spam toggle attempts by rate-limiting calls from the same session
        const now = Date.now();
        if (req.session.lastRegAction && (now - req.session.lastRegAction < 2000)) {
            return res.status(429).json({ success: false, error: "Please wait a moment between registration updates." });
        }
        req.session.lastRegAction = now;

        const formIdRaw = req.body?.formId;
        if (typeof formIdRaw !== "string") {
            return res.status(400).json({ success: false, error: "formId must be a string." });
        }
        const formId = formIdRaw.trim();
        if (!formId) {
            return res.status(400).json({ success: false, error: "formId is required." });
        }

        try {
            const forms = await readDB("Main", "RegistrationForms", { id: formId });
            if (forms.length === 0) {
                return res.status(404).json({ success: false, error: "Registration form not found." });
            }

            const form = forms[0];

            // Verify registration is still open
            if (new Date(form.deadline) <= new Date()) {
                return res.status(400).json({ success: false, error: "Registration has closed for this event." });
            }

            const email = req.user.emails[0].value;
            const name = req.user.displayName || email;

            // Check if user is already registered to avoid duplicates
            const isAlreadyRegistered = (form.registrants || []).some(r => r.email.toLowerCase() === email.toLowerCase());
            if (isAlreadyRegistered) {
                return res.json({ success: true, message: "You are already registered." });
            }

            const registrant = {
                email,
                name,
                registeredAt: new Date().toISOString()
            };

            // Query filter verifies that user email does not exist in registrants array, preventing concurrent double-submissions
            await updateDB("Main", "RegistrationForms", { id: formId, "registrants.email": { $ne: email } }, { $push: { registrants: registrant } });
            updateLog(req, "Registered for event: " + form.title);

            res.json({ success: true, message: "Registered successfully!" });
        } catch (err) {
            res.json({ success: false, error: err.message });
        }
    });

    // API to unregister a user from an event (Logged-in users only)
    app.post("/api/unregister-event", isLoggedIn, updateLastActivity, async (req, res) => {
        // Debounce spam toggle attempts by rate-limiting calls from the same session
        const now = Date.now();
        if (req.session.lastRegAction && (now - req.session.lastRegAction < 2000)) {
            return res.status(429).json({ success: false, error: "Please wait a moment between registration updates." });
        }
        req.session.lastRegAction = now;

        const formIdRaw = req.body?.formId;
        if (typeof formIdRaw !== "string") {
            return res.status(400).json({ success: false, error: "formId must be a string." });
        }
        const formId = formIdRaw.trim();
        if (!formId) {
            return res.status(400).json({ success: false, error: "formId is required." });
        }

        try {
            const forms = await readDB("Main", "RegistrationForms", { id: formId });
            if (forms.length === 0) {
                return res.status(404).json({ success: false, error: "Registration form not found." });
            }

            const form = forms[0];
            const email = req.user.emails[0].value;

            await updateDB("Main", "RegistrationForms", { id: formId }, { $pull: { registrants: { email: email } } });
            updateLog(req, "Unregistered from event: " + form.title);

            res.json({ success: true, message: "Unregistered successfully!" });
        } catch (err) {
            res.json({ success: false, error: err.message });
        }
    });
};
