import { messagesModel } from "../../models/messages.js";

export default class MessageManager {
    constructor() {
    }
    //Get all messages from the database
    get = async () => {
        try {
            const messages = await messagesModel.find();
            return messages.map(message => message);
        } catch (error) {
            throw error ; 
        }
    }
    // Add a new message to the database
    add = async (messageData) => {
        try {
            const result = await messagesModel.create(messageData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    
}