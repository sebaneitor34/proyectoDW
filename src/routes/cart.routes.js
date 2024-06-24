import { Router } from "express";
import {
  renderCart,
  addCart,
  removeCart,
  comprar,
  createReceipt,
  renderRecibos,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/Carrito", comprar);

router.get("/Carrito", renderCart);

router.post("/albumPages/:id", addCart);

router.post("/addCart/:id", addCart);

router.post("/removeCart/:id", removeCart);

router.post("/Carrito", createReceipt);

router.get("/recibos", renderRecibos);

export default router;
