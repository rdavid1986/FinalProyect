import { Router } from "express";
import {products,realtimeProducts,chat,cart,login,register,profile,resetPassword,notFound} from "../controllers/routes/views.js";
import {adminAccess,userAccess,privateAccess,publicAccess}from "../controllers/routes/accessMiddleware.js"
import {recoverView} from "../controllers/routes/views.js";
import {restorePassword} from "../controllers/routes/views.js";

const router = Router();

router.get('/products', privateAccess, products );
router.get('/realTimeProducts',adminAccess, realtimeProducts);
router.get("/chat", privateAccess, chat);
router.get('/cart/:cid',privateAccess, userAccess, cart );
router.get('/', publicAccess , login)
router.get('/register' , register);
router.get('/profile', privateAccess, profile);
router.get('/resetPassword', resetPassword );
router.get('/mailToRestorePassword', recoverView );
router.get('/restorePassword/:recovertoken', restorePassword );
router.use(notFound);

export default router;