import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

// Estende o tipo do Express Request pra carregar a cápsula já carregada
// e evitar uma segunda query no controller
declare global {
  namespace Express {
    interface Request {
      capsule?: {
        id: string;
        editToken: string;
        status: string;
      };
    }
  }
}

/**
 * Autentica ações de edição/exclusão de uma cápsula via editToken.
 * Esperado no header: Authorization: Bearer <editToken>
 *
 * Como o produto é anônimo (sem login), o editToken é a única credencial
 * que comprova que quem está fazendo a requisição é o "dono" da cápsula.
 */
export async function requireEditToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Token de edição não fornecido" });
  }

  const { id } = req.params;

  const capsule = await prisma.capsule.findUnique({
    where: { id },
    select: { id: true, editToken: true, status: true },
  });

  if (!capsule || capsule.editToken !== token) {
    return res.status(403).json({ error: "Token de edição inválido" });
  }

  req.capsule = capsule;
  next();
}
