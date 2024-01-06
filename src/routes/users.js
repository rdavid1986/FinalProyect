import {Router} from "express";
import {userPremium} from "../controllers/routes/users.js";
import {addProduct} from "../controllers/routes/products.js";
import {uploadDocuments, getUsers, deleteUsers, getUser, changeRole, deleteUser} from "../controllers/routes/users.js"
import {uploader} from "../utils.js";
import {premiumAccess} from "../middleware/auth.js"
import {adminAccess,userAccess,privateAccess,publicAccess}from "../middleware/auth.js"
const router = Router();

router.get("/premium/:uid", userPremium);
router.get("/get", getUsers);
router.get("/getuser", getUser);
router.post("/changeRole",adminAccess, changeRole); //Change user role
router.delete("/deleteUser",adminAccess, deleteUser); // delete user by email
router.delete("/delete", deleteUsers); // delete inactivity user
router.post("/:uid/documents", uploader.array("documents"), uploadDocuments);
router.post("/:uid/product", premiumAccess, uploader.array('thumbnail'), addProduct);

export default router;