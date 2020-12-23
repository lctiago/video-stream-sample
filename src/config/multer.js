const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'assets'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'assets'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(20, (err, hash) => {
                if (err) cb(err);
                cb(null, file.originalname);
            })
        }
    }),
    limits: {
        fileSize: 500 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'video/mp4',
        ];
        const fileMimeTypeIsAllowed = allowedMimes.includes(file.mimetype);
        if (fileMimeTypeIsAllowed) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
}