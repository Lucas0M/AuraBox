import cors from "cors";
import express from "express";
import { capsulesRouter } from "./routes/capsules.js";
import { checkoutRouter } from "./routes/checkout.js";
import { healthRouter } from "./routes/health.js";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/health", healthRouter);
app.use("/api/capsules", capsulesRouter);
app.use("/api/checkout", checkoutRouter);

app.use((request, response) => {
  response.status(404).json({
    error: "Not Found",
    path: request.path,
  });
});
