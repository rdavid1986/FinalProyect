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

router.get("/", getProducts);
router.post('/', addProduct)
router.get('/', paginateProducts);
router.get('/:pid', getProductsById);
router.put("/:pid", adminAccess, updateProduct);
router.delete("/:pid", adminAccess, deleteProduct);

export default router;


