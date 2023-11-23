import { Router } from "express";
import {
    getProducts,
    addProduct,
    paginateProducts,
    getProductsById,
    updateProduct,
    deleteProduct,
}from "../controllers/routes/products.js";
import {
    adminAccess,
    userAccess,
    premiumAccess
} from "../middleware/auth.js"

const router = new Router();

router.get("/", adminAccess , userAccess, getProducts);
router.post('/', adminAccess, addProduct)
router.get('/', adminAccess , userAccess, paginateProducts);
router.get('/:pid', adminAccess , userAccess, getProductsById);
router.put("/:pid", adminAccess, updateProduct);
router.delete("/:pid", adminAccess, deleteProduct);

export default router;


