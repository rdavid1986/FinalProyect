import {Router} from "express";
import {restorePassword} from "../controllers/routes/restorePassword.js";
import {adminAccess, userAccess} from "../middleware/auth.js"
import {verifyToken} from "../middleware/auth.js"

const router = Router();

router.post("/:recovertoken", restorePassword);

export default router;