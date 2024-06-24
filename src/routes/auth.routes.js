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

const router = Router();

// Routes
router.get("/signup", renderSignUpForm);

router.post("/signup", signup);

router.get("/login", renderSigninForm);

router.post("/login", signin);

router.get("/Cuenta",renderCuenta);

router.get("/wallet",renderWallet);

router.post('/addWallet',addWallet);

router.get("/logout", logout);

export default router;