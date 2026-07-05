// Functions for opening/closing overlays (matching Knuth's existing UI helper pattern)
function openIt(id) {
    const el = document.getElementById(id);
    if (el) el.removeAttribute("hidden");
}

function closeIt(id) {
    const el = document.getElementById(id);
    if (el) el.setAttribute("hidden", "true");
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Countdown Timers Logic
    const updateCountdowns = () => {
        document.querySelectorAll(".countdown-badge").forEach(badge => {
            // Skip processing for already expired timers to optimize CPU usage
            if (badge.classList.contains("closed-timer")) return;

            const deadlineStr = badge.getAttribute("data-deadline");
            if (!deadlineStr) return;

            const deadline = new Date(deadlineStr);
            const now = new Date();
            const timeRemaining = deadline - now;

            if (timeRemaining <= 0) {
                badge.innerText = "Closed";
                badge.className = "badge countdown-badge px-3 py-2 font-weight-bold closed-timer";

                // If registration is closed, find the registration button inside the card and disable it
                const card = badge.closest(".form-card");
                if (card) {
                    const actionBtn = card.querySelector(".action-btn");
                    if (actionBtn) {
                        actionBtn.innerText = "Registration Closed";
                        actionBtn.className = "btn btn-secondary px-4 py-2";
                        actionBtn.disabled = true;
                    }
                }
            } else {
                badge.className = "badge countdown-badge px-3 py-2 font-weight-bold active-timer";

                // Format time remaining: Days, Hours, Minutes, Seconds
                const seconds = Math.floor((timeRemaining / 1000) % 60);
                const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
                const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

                let countdownText = "";
                if (days > 0) {
                    countdownText += `${days}d ${hours}h ${minutes}m`;
                } else if (hours > 0) {
                    countdownText += `${hours}h ${minutes}m ${seconds}s`;
                } else {
                    countdownText += `${minutes}m ${seconds}s`;
                }

                badge.innerText = countdownText;
            }
        });
    };

    // Run countdown update immediately and refresh every second
    updateCountdowns();
    setInterval(updateCountdowns, 1000);

    // 2. Create Registration Form Submit (Coordinators)
    const createForm = document.getElementById("createForm");
    if (createForm) {
        createForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const title = document.getElementById("formTitle").value.trim();
            const description = document.getElementById("formDescription").value.trim();
            const deadlineRaw = document.getElementById("formDeadline").value;
            const msg = document.getElementById("formMsg");

            // Character limits & basic size validations
            if (title.length > 100) {
                msg.style.display = "block";
                msg.className = "alert alert-danger py-1 small mt-2";
                msg.innerText = "Title must be under 100 characters.";
                return;
            }

            if (!deadlineRaw) {
                msg.style.display = "block";
                msg.className = "alert alert-danger py-1 small mt-2";
                msg.innerText = "Deadline is required.";
                return;
            }

            const deadlineDate = new Date(deadlineRaw);
            if (isNaN(deadlineDate.getTime())) {
                msg.style.display = "block";
                msg.className = "alert alert-danger py-1 small mt-2";
                msg.innerText = "Invalid deadline date.";
                return;
            }

            if (deadlineDate <= new Date()) {
                msg.style.display = "block";
                msg.className = "alert alert-danger py-1 small mt-2";
                msg.innerText = "Deadline must be in the future.";
                return;
            }

            // Convert local selected date into UTC ISO String before sending to server
            const deadline = deadlineDate.toISOString();

            try {
                const res = await axios.post("/api/create-registration-form", {
                    title,
                    description,
                    deadline
                });

                if (res.data.success) {
                    msg.style.display = "block";
                    msg.className = "alert alert-success py-1 small mt-2";
                    msg.innerText = "Success! Reloading...";
                    setTimeout(() => location.reload(), 1000);
                } else {
                    msg.style.display = "block";
                    msg.className = "alert alert-danger py-1 small mt-2";
                    msg.innerText = "Failed: " + res.data.error;
                }
            } catch (err) {
                msg.style.display = "block";
                msg.className = "alert alert-danger py-1 small mt-2";
                msg.innerText = "Error: " + (err.response?.data?.error || err.message);
            }
        });
    }

    // 3. Delete Registration Form Click (Coordinators)
    document.querySelectorAll(".delete-form-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const formId = btn.getAttribute("data-form-id");
            if (!formId) return;

            if (!confirm("Are you sure you want to delete this registration form? This will remove all registrant history.")) {
                return;
            }

            try {
                const res = await axios.post("/api/delete-registration-form", { formId });
                if (res.data.success) {
                    location.reload();
                } else {
                    alert("Failed to delete form: " + res.data.error);
                }
            } catch (err) {
                alert("Error: " + (err.response?.data?.error || err.message));
            }
        });
    });

    // 4. Register For Event Click
    document.querySelectorAll(".register-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const formId = btn.getAttribute("data-form-id");
            if (!formId) return;

            btn.disabled = true;
            btn.innerText = "Registering...";

            try {
                const res = await axios.post("/api/register-event", { formId });
                if (res.data.success) {
                    location.reload();
                } else {
                    alert("Registration failed: " + res.data.error);
                    btn.disabled = false;
                    btn.innerText = "Register Now";
                }
            } catch (err) {
                alert("Error: " + (err.response?.data?.error || err.message));
                btn.disabled = false;
                btn.innerText = "Register Now";
            }
        });
    });

    // 5. Unregister From Event Click
    document.querySelectorAll(".unregister-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const formId = btn.getAttribute("data-form-id");
            if (!formId) return;

            if (!confirm("Are you sure you want to cancel your registration for this event?")) {
                return;
            }

            btn.disabled = true;
            btn.innerText = "Unregistering...";

            try {
                const res = await axios.post("/api/unregister-event", { formId });
                if (res.data.success) {
                    location.reload();
                } else {
                    alert("Unregistration failed: " + res.data.error);
                    btn.disabled = false;
                    btn.innerText = "Registered ✓ (Unregister)";
                }
            } catch (err) {
                alert("Error: " + (err.response?.data?.error || err.message));
                btn.disabled = false;
                btn.innerText = "Registered ✓ (Unregister)";
            }
        });
    });

    // 6. Export Registrants to Excel (CSV)
    document.querySelectorAll(".export-csv-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".form-card");
            if (!card) return;
            const table = card.querySelector("table");
            if (!table) return;

            const formTitle = btn.getAttribute("data-form-title") || "registrations";
            const rows = Array.from(table.querySelectorAll("tr"));
            
            const csvContent = rows.map(row => {
                const cells = Array.from(row.querySelectorAll("th, td"));
                return cells.map(cell => {
                    let text = cell.innerText.trim();
                    text = text.replace(/"/g, '""');
                    return `"${text}"`;
                }).join(",");
            }).join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `registrations_${formTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
});
