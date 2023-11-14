import MessageManager from "../../dao/mongo/messagesManager.js";

const messageManager = new MessageManager();

export const getMessages = async (req, res) => {
    try{
        //Get messages
        let messages = await messageManager.get();
        //Response
        res.send({status: 'success', payload: messages});
    }catch(error){
        console.log('Error de conexion');
        req.logger.error("error");
    }
}
export const addMessages = async (req, res) => {
    try {
        //Add new messages
        const messages = await messageManager.add(req.body);
        //Response
        return res.send({status: "success", payload:messages});
    } catch (error) {
        req.logger.error("error");
        return res.send({status: "error", error: "Duplicated code. Select another code" });
    }
}
