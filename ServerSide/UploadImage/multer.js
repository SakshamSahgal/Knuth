const multer = require("multer");
    const fs = require("fs");

    const storageEngine = multer.diskStorage({ //setting up multer storage engine
        destination: 'uploads/',
        filename: (req, file, cb) => {
            cb(null, '_' + Date.now() + '_' + file.originalname ); //naming each file with the current date (we append original name at end to automatically add the file extension)
        }
    })

    const upload = multer({ //middleware to upload files
        storage: storageEngine,
        limits: {
            fileSize: parseInt(process.env.ImageSizeLimitInBytes) , //setting up file size limit to 1MB
            files: parseInt(process.env.ImageUploadLimit)
        },
    })

    const multerErrorHandling = (err, req, res, next) => { //middleware to handle multer errors

        if (err instanceof multer.MulterError) {
            return res.send(err.message);
        } else {
            next();
        }
    }

    const TypeCheck = (req, res, next) => { //middleware to check the file type
        
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif']; //allowed file types
        
        var notallowed = false;

        for (let i = 0; i < req.files.length; i++) {
            if (!allowedFileTypes.includes(req.files[i].mimetype)) {
                notallowed = true;
                break;
            }
        }
        
        if (notallowed) {

            for (let i = 0; i < req.files.length; i++) 
                fs.unlinkSync(req.files[i].path); //deleting all the uploaded files
            
            return res.send("one or more File type is not supported");
        }

        next();
    }

    module.exports = {upload,multerErrorHandling,TypeCheck}