import { Router } from "express";
import {
  renderSignUpForm,
  signup,
  renderSigninForm,
  renderCuenta,
  renderWallet,
  addWallet,
  signin,
  logout,
} from "../controllers/auth.controller.js";
import authRequired from "../middlewares/auth.js";
const router = Router();

// Routes
router.get("/signup", renderSignUpForm);
router.post("/signup", signup);
router.get("/login", renderSigninForm);
router.post("/login", signin);
router.get("/Cuenta", renderCuenta);
router.get("/wallet", renderWallet);
router.post('/addWallet', addWallet);
router.get("/logout", logout);

// Ruta para usuarios no autorizados
router.get('/unauthorized', (req, res) => {
  res.render('unauthorized', { message: req.flash('error_msg') });
});

export default router;

