import { Router } from 'express';
import {loggerTest} from "../controllers/routes/loggerTest.js"

const router = Router();

router.get("/", loggerTest);

export default router;