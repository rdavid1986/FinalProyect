import {Router} from "express";
import {userPremium} from "../controllers/routes/users.js";
import {addProduct} from "../controllers/routes/products.js";
import {uploadDocuments} from "../controllers/routes/users.js"
import {uploader, /* uploadProduct */} from "../utils.js";
import {premiumAccess} from "../middleware/auth.js"
import {adminAccess,userAccess,privateAccess,publicAccess}from "../middleware/auth.js"
const router = Router();

router.get("/premium/:uid", userPremium);
router.post("/:uid/documents", uploader.array("documents"), uploadDocuments);
router.post("/:uid/product", premiumAccess, uploader.array('thumbnail'), addProduct);

export default router;