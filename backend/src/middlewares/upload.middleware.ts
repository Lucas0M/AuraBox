import multer from "multer";

const MAX_IMAGE_SIZE_MB = 8;
const MAX_AUDIO_SIZE_MB = 20; // mp3 de música inteira costuma pesar mais que foto

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Tipo de arquivo não suportado. Use JPEG, PNG, WEBP ou HEIC."));
    }
    callback(null, true);
  },
});

export const uploadAudio = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AUDIO_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/ogg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Tipo de arquivo não suportado. Use MP3, WAV ou OGG."));
    }
    callback(null, true);
  },
});

