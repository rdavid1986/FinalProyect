import { Router } from 'express';

const router = Router();

import  {
    addCart,
    getCarts,
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    deleteProducts,
    updateQuantityProductInCart,
    purchase
} from "../controllers/routes/cart.js";
import {
    adminAccess,
    userAccess
}from "../controllers/routes/accessMiddleware.js"
router.post("/", addCart);
router.get("/", getCarts);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", userAccess, addProductToCart);
router.delete("/:cid/products/:pid", deleteProductFromCart);
router.delete("/:cid", deleteProducts);
router.put("/:cid/products/:pid", updateQuantityProductInCart);
router.get("/:cid/purchase", purchase);

export default router;