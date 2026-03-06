import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.log(`TaxFlow backend rodando na porta ${env.PORT}`);
});
