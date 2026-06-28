import { cloudinary } from "../lib/cloudinary";

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

export class UploadService {
  /**
   * Recebe o buffer de um arquivo (vindo do multer, memory storage)
   * e envia para a Cloudinary, retornando a URL pública segura (https).
   */
  async uploadImage(fileBuffer: Buffer, mimetype: string): Promise<string> {
    const base64 = fileBuffer.toString("base64");
    const dataUri = `data:${mimetype};base64,${base64}`;

    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "capsula-do-tempo",
        resource_type: "image",
        // limita o tamanho máximo, mantendo proporção, pra evitar
        // imagens gigantes de celular pesando no carregamento da timeline
        transformation: [{ width: 1600, height: 1600, crop: "limit" }],
      });

      return result.secure_url;
    } catch (error) {
      throw new UploadError("Falha ao enviar imagem para o Cloudinary");
    }
  }
}

export const uploadService = new UploadService();
