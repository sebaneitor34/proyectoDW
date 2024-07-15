import { Router } from "express";
import {
  renderCart,
  addCart,
  removeCart,
  comprar,
  createReceipt,
  renderRecibos,
  renderAllReceipts,
  renderReceiptDetail,
} from "../controllers/cart.controller.js";
import authRequired from "../middlewares/auth.js";

const router = Router();

router.post("/Carrito", comprar);
router.get("/Carrito", renderCart);
router.post("/Camisetas/:id", addCart);
router.post("/addCart/:id", addCart);
router.post("/removeCart/:id", removeCart);
router.post("/Carrito", createReceipt);

// Proteger la ruta de recibos con autenticación
router.get("/recibos", renderRecibos);

// Nueva ruta para listar todas las compras del usuario actual
router.get("/bills", renderAllReceipts);

// Nueva ruta para obtener el detalle de una compra específica
router.get("/bills/:id", renderReceiptDetail);

export default router;

