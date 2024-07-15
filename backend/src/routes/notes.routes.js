import { Router } from "express";
import {
  renderProductForm,
  createNewProduct,
  renderProducts,
  renderEditForm,
  editProduct,
  deleteProduct,
  renderCamisetas
} from "../controllers/products.controller.js";
import authRequired from "../middlewares/auth.js";
import adminRequired from "../middlewares/admin.js";

const router = Router();

// Ruta para mostrar el formulario de agregar producto (protegida)
router.get('/addProduct', authRequired, adminRequired, (req, res) => {
  console.log('Accediendo a /addProduct');
  renderProductForm(req, res);
});

// Ruta para crear un nuevo producto (protegida)
router.post('/products', authRequired, adminRequired, (req, res) => {
  console.log('Creando un nuevo producto');
  createNewProduct(req, res);
});

// Ruta para mostrar el formulario de edición de producto (protegida)
router.get('/editProduct/:id', authRequired, adminRequired, (req, res) => {
  console.log('Accediendo a /editProduct');
  renderEditForm(req, res);
});

// Ruta para editar un producto (protegida)
router.post('/edit/:id', authRequired, adminRequired, (req, res) => {
  console.log('Editando un producto');
  editProduct(req, res);
});

// Rutas existentes
router.get('/', renderProducts);
router.get('/Camisetas/:id', renderCamisetas);
router.get('/delete/:id', deleteProduct);

export default router;







