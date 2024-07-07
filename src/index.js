import { configDotenv } from "dotenv";
import app from "./server.js";
import { createAdminUser } from "./libs/createUser.js";
import "./database.js";

async function main() {
  configDotenv();
  await createAdminUser();
  app.listen(app.get("port"), () => {
    console.log("Servidor en el puerto: ", app.get("port"))
  });

  console.log("Environment:", process.env.NODE_ENV);
}

main();
