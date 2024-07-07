import { configDotenv } from "dotenv";
import app from "./server.js";
import { createAdminUser } from "./libs/createUser.js";
import "./database.js";


app.listen(app.get("port"), () => {
  console.log("Servidor en el puerto: ", app.get("port"))
});

