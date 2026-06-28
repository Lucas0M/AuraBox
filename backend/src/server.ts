import "dotenv/config"; // PRECISA ser o primeiro import — carrega o .env pro process.env
                          // antes de qualquer outro módulo (especialmente config/env.ts) ser avaliado
import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${env.PORT}`);
});
