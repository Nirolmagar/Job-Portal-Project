const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir); // Ensure the correct path
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = function(req, file, cb) {
    const allowedTypes = /pdf/;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const isFileTypeValid = allowedTypes.test(fileExtension);
    const isMimeTypeValid = allowedTypes.test(file.mimetype);

    if (isFileTypeValid && isMimeTypeValid) {
        cb(null, true); // Fix typo: ture -> true
    } else {
        cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
    }
}

const upload = multer({ storage, fileFilter });
module.exports = upload;


