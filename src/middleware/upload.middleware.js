import multer, { memoryStorage } from "multer";
import { extname as _extname } from "path";

const storage = memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(
            _extname(file.originalname).toLowerCase()
        );
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file));
        }
    },
});

export default upload;
