import {Router} from "express";
import MessagesManager from "../dao/mongo/messagesManager.js";
import {
    getMessages,
    addMessages
}from "../controllers/routes/messages.js";
import {
    adminAccess,
    userAccess
}from "../controllers/routes/accessMiddleware.js"
const router = Router();

const messagesManager = new MessagesManager();
//Get messages
router.get("/", getMessages);

//Add messages
router.post('/', userAccess, addMessages )

export default router;