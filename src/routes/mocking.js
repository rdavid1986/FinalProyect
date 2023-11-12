import {Router} from "express";
import {generateProducts} from "./../controllers/routes/mokignProducts.js";

const router = Router();

router.get("/", generateProducts);

export default router;