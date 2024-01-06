import MessageManager from "../../dao/mongo/messagesManager.js";

const messageManager = new MessageManager();

export const getMessages = async (req, res) => {
    try {
        let messages = await messageManager.get();
        res.send({status: 'success', payload: messages});
    } catch (error) {
        req.logger.error(`Controller messages getMessages ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
   
}
export const addMessages = async (req, res) => {
    try {
        const messages = await messageManager.add(req.body);
        return res.send({status: "success", payload:messages});
    
    } catch (error) {
        req.logger.error(`Controller messages addMessages ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
}
