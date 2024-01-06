import { Router } from "express";
import {products,realtimeProducts,chat,cart,login,register,profile,resetPassword,notFound, adminview, recoverView, restorePassword} from "../controllers/routes/views.js";
import {adminAccess,userAccess,privateAccess,publicAccess}from "../middleware/auth.js";
import {getUser} from "../controllers/routes/users.js"

const router = Router();

router.get('/products', privateAccess, products );
router.get('/realTimeProducts',adminAccess, realtimeProducts);
router.get('/adminview',adminAccess, adminview);
router.get("/chat", privateAccess, chat);
router.get('/cart/:cid',privateAccess, userAccess, cart );
router.get('/', publicAccess , login)
router.get('/register' , register);
router.get('/profile', privateAccess, profile);
router.get('/resetPassword', resetPassword );
router.get('/purchase' );
router.get('/mailToRestorePassword', recoverView );
router.get('/restorePassword/:recovertoken', restorePassword );
router.use(notFound);

export default router;