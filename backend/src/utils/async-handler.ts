import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Envolve um handler async para que qualquer erro/rejeição seja
 * automaticamente repassado ao next(), chegando no error handler global.
 *
 * Necessário porque o Express (até a v4) não captura rejeições de Promise
 * automaticamente — sem isso, um erro lançado dentro de um controller async
 * (ex: prisma.capsule.create falhando) deixaria a requisição pendurada
 * sem resposta, em vez de cair no error handler.
 */
export function asyncHandler(handler: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
