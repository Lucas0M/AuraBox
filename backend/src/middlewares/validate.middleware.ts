import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Valida req.body contra o schema fornecido.
 * Se válido, substitui req.body pelo dado já parseado (com defaults aplicados).
 * Se inválido, responde 400 com a lista de erros.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data;
    next();
  };
}
