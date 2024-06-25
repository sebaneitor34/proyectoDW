import { Router } from "express";
import { renderProductForm, createNewProduct,renderProducts,renderEditForm,editProduct,deleteProduct,renderCamisetas} from "../controllers/products.controller.js";
import authRequired from '../middlewares/auth.js';
import adminRequired from "../middlewares/admin.js";
const router =Router();

// products.routes.js (corregido)
router.get('/addProduct',renderProductForm);

router.post ('/addProduct', createNewProduct);

router.get('/',renderProducts);

router.get('/editProduct/:id',renderEditForm);

router.post('/edit/:id',editProduct);

router.get('/Camisetas/:id',renderCamisetas);

router.get('/delete/:id',deleteProduct);

export default router;