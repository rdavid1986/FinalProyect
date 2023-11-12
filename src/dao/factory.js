import config from "./config/config.js";

export let cart;
export let messages;
export let products;

switch(config.persistence){
    case "MONGO":
        const connection = mongoog.connect(config.mongoUrl);
        const{default: persistenceCartMongo} = await import("./mongoCartManager/mongoCartManager.js");
        const{default: persistenceMessagesMongo} = await import("./mongo/messagesManager.js");
        const{default: persistenceProductsMongo} = await import("./mongo/productManager.js");
        cart = persistenceCartMongo;
        messages = persistenceMessagesMongo
        products = persistenceProductsMongo;
        break;
    case "MEMORY":
        const{default: persistenceCartMemory} = await import("./memory/cartsManager.js");
        const{default: persistenceMessagesMemory} = await import("./memory/messagesManager.js");
        const{default: persistenceProductsMemory} = await import("./memory/productManager.js");
        cart = persistenceCartMemory;
        messages = persistenceMessagesMemory
        products = persistenceProductsMemory;
        break;
    default:
        console.log('No form of persistence was found')
        break;        
}
//No estoy utilizando factory , 
//igualmente queria tener los archivos en mi proyecto,
//pero este no esta en una escala como para utilizar factory tal cual dijo el profesor en clase