import 'dotenv/config';
import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { create } from "express-handlebars";
import cookieParser from "cookie-parser"; // Importar cookie-parser
const port = 3000;
import { MONGODB_URI, PORT } from "./config.js";

import cartRoutes from "./routes/cart.routes.js";
import indexRoutes from "./routes/index.routes.js";
import userRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import "./config/passport.js";
import authRequired from "./middlewares/auth.js";
import adminRequired from "./middlewares/admin.js";

// Initializations
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Verificar que la variable JWT_SECRET esté cargada correctamente
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// settings
app.set("port", PORT);
app.set("views", join(__dirname, "views"));

const hbs = create({ extname: ".hbs" }); // Crear instancia del motor de plantillas
app.engine(".hbs", hbs.engine); // Configurar motor de plantillas
app.set("view engine", ".hbs");

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser()); // Usar cookie-parser
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use(express.static(join(__dirname, "public")));

// routes
app.use(indexRoutes);
app.use(userRoutes);
app.use(cartRoutes);
app.use(notesRoutes);

// static files
app.use((req, res, next) => {
  return res.status(404).render("404");
});

app.use((error, req, res, next) => {
  console.error('Error detectado:', error.stack); // Registrar el error en la consola
  req.flash('error_msg', 'Ocurrió un error en el servidor.');
  res.status(error.status || 500);
  res.render("error", {
    message: req.flash('error_msg'),
    error,
  });
});


export default app;
