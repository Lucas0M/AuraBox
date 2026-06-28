import express from "express";
import cors from "cors";
import { env } from "./config/env";
import capsulesRoutes from "./routes/capsules";
import checkoutRoutes from "./routes/checkout";
import webhooksRoutes from "./routes/webhooks";
// import healthRoutes from "./routes/health"; // já existente no seu projeto

const app = express();

app.use(cors({ origin: env.FRONTEND_URL }));

/**
 * ORDEM IMPORTA AQUI.
 *
 * A rota de webhook (/webhooks/abacatepay) precisa do raw body — ver
 * routes/webhooks.ts — então ela é registrada ANTES do express.json()
 * global, garantindo que o raw() interno daquela rota capture o stream
 * intacto antes de qualquer outro parser tocar nele.
 */
app.use("/webhooks", webhooksRoutes);

// A partir daqui, todo o resto da API usa JSON normalmente
app.use(express.json());

app.use("/capsules", capsulesRoutes);
app.use("/checkout", checkoutRoutes);
// app.use("/health", healthRoutes);

// Handler de erro genérico — captura exceptions não tratadas nos controllers
// (ex: erros do Prisma, da AbacatePay, do Cloudinary) e evita que o processo
// quebre ou que stack traces sejam expostos ao cliente.
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
);

export default app;
