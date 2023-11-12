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
    userAccess
} from "../controllers/routes/accessMiddleware.js"
import {addLogger} from "../logger.js"

const router = new Router();

router.get("/", userAccess, getProducts);
router.post('/', adminAccess, addProduct)
router.get('/', paginateProducts);
router.get('/:pid', getProductsById);
router.put("/:pid", adminAccess, updateProduct);
router.delete("/:pid", adminAccess, deleteProduct);

export default router;


