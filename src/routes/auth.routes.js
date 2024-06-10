import { Router } from "express";
import {
  renderSignUpForm,
  signup,
  renderSigninForm,
  signin,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

// Routes
router.get("signup.html", renderSignUpForm);

router.post("signup.html", signup);

router.get("login.html", renderSigninForm);

router.post("login.html", signin);

router.get("/auth/logout", logout);

export default router;