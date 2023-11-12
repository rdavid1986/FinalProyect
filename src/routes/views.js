import { Router } from "express";
import {products,realtimeProducts,chat,cart,login,register,profile,resetPassword,notFound,publicAccess,privateAccess} from "../controllers/routes/views.js";
import {adminAccess,userAccess}from "../controllers/routes/accessMiddleware.js"

const router = Router();

router.get('/products', privateAccess, products );
router.get('/realTimeProducts',adminAccess, realtimeProducts);
router.get("/chat", privateAccess, chat);
router.get('/cart/:cid',privateAccess, userAccess, cart );
router.get('/', publicAccess , login)
router.get('/register' , register);
router.get('/profile', privateAccess, profile);
router.get('/resetPassword', resetPassword );
router.use(notFound);

export default router;