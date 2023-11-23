import {Router} from "express";
import {mailToRestorePassword} from "../controllers/routes/mailToRestorePassword.js";
import {adminAccess, userAccess} from "../controllers/routes/accessMiddleware.js"

const router = Router();

router.post("/", mailToRestorePassword);

export default router;