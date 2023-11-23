import {Router} from "express";
import {userPremium} from "../controllers/routes/users.js";

const router = Router();

router.get("/premium/:uid", userPremium);

export default router;