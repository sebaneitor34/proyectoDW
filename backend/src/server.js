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
import cookieParser from "cookie-parser"; 



import cartRoutes from "./routes/cart.routes.js";
import indexRoutes from "./routes/index.routes.js";
import userRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import "./config/passport.js";
import authRequired from "./middlewares/auth.js";
import adminRequired from "./middlewares/admin.js";

console.log('EVENTS_APP_MONGODB_HOST:', process.env.EVENTS_APP_MONGODB_HOST);
console.log('EVENTS_APP_MONGODB_DATABASE:', process.env.EVENTS_APP_MONGODB_DATABASE);

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));


console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const port = process.env.PORT || 3000;

app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "../../frontend/src/views"));


const hbs = create({ extname: ".hbs" }); 
app.engine(".hbs", hbs.engine); 
app.set("view engine", ".hbs");


app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser()); 
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use(express.static(join(__dirname, "../../frontend/src/public")));



app.use(indexRoutes);
app.use(userRoutes);
app.use(cartRoutes);
app.use(notesRoutes);


app.use((req, res, next) => {
  return res.status(404).render("404");
});

app.use((error, req, res, next) => {
  console.error('Error detectado:', error.stack);
  req.flash('error_msg', 'Ocurrió un error en el servidor.');
  res.status(error.status || 500);
  res.render("error", {
    message: req.flash('error_msg'),
    error,
  });
});


export default app;
