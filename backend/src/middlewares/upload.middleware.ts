import multer from "multer";

const MAX_FILE_SIZE_MB = 8;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Tipo de arquivo não suportado. Use JPEG, PNG, WEBP ou HEIC."));
    }
    callback(null, true);
  },
});
