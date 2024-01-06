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
import {uploader} from "../utils.js";
const router = new Router();

router.get("/", getProducts);
router.post('/' , uploader.array('thumbnail') , addProduct)
router.get('/', paginateProducts);
router.get('/:pid', getProductsById);
router.put("/:pid", updateProduct);
router.delete("/:pid", deleteProduct);

export default router;


