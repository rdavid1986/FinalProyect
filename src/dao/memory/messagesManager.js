import { messagesModel } from "../../models/messages.js";

export default class MessageManager {
    constructor() {
        this.messages = [];
        this.path = path;
    }
    saveData = () => {
        const data = JSON.stringify(this.messages, null, 4);
        fs.writeFileSync(this.path, data);
    }
    loadData = () => {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, "utf-8");
            this.messages = JSON.parse(data);
        }
    }
    //Get all messages from the database
    get = async () => {
        try {
            return this.messages;
        } catch (error) {
            throw error ; 
        }
    }
    // Add a new message to the database
    add = async (messageData) => {
        try {
            this.loadData();
            this.messages.push(messageData);
            this.saveData();
            return result;
        } catch (error) {
            throw error;
        }
    }
    
}