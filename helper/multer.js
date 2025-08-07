import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, global.uploadURL); // make sure global.uploadURL is set somewhere (e.g., server.js)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    cb(null, `${timestamp}-${name}${ext || '.ogg'}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'text/csv',
    'audio/mpeg',
    'audio/wav',
  ];

  cb(null, allowedTypes.includes(file.mimetype));
};

export const upload = multer({ storage, fileFilter });