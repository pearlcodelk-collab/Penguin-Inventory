import multer from "multer";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
]);

function imageOnlyFilter(_req, file, cb) {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
}

const upload = multer({
  storage: multer.memoryStorage(), // keep file in memory; do not write to disk
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageOnlyFilter,
});

export default upload;


