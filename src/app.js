import express from "express";
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import handlebars from "express-handlebars";
import productsRouter from "../src/routes/products.js";
import messagesRouter from "../src/routes/messages.js";
import cartsRouter from "../src/routes/carts.js";
import viewsRouter from "../src/routes/views.js";
import sessionRouter from "../src/routes/session.js";
import usersRouter from "../src/routes/users.js";
import mockingRouter from "../src/routes/mocking.js";
import ProductsManager from "./dao/mongo/productManager.js";
import MessageManager from "./dao/mongo/messagesManager.js"
import loggerTestRouter from "../src/routes/loggerTest.js";
import restorePasswordRouter from "../src/routes/restorePassword.js";
import mailToRestorePasswordRouter from "../src/routes/mailToRestorePassword.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from 'express-session';
import passport from "passport";
import { initializePassport } from "../src/config/passport.js";
import config from "./config/config.js";
import errorHandler from "../src/middleware/errorsMiddlewares.js";
import {addLogger} from "./logger.js"
import swaggerJSDoc from 'swagger-jsdoc'; 
import swaggerUiExpress from "swagger-ui-express";


const app = express();

const PORT = config.port || 8080;
const mongoURL = config.mongoUrl
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:"CoderHouse Ecommerce",
            description:"API Ecommerce"
        }
    },
    apis:[`${__dirname}/docs/**/*.yaml`]
}

//connect to mongo
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoURL,
        ttl: 600
    }),
    secret: "CoderSecret",
    resave: false,
    saveUninitialized: false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
// Configure URL dynamism
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configure public folder
app.use(express.static(`${__dirname}/public`));

//Configure routes
app.use(errorHandler);
app.use(addLogger);
app.use('/api/docs', swaggerUiExpress.serve,swaggerUiExpress.setup(swaggerJSDoc(swaggerOptions)));
app.use('/api/loggerTest', loggerTestRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chat', messagesRouter);
app.use('/api/session', sessionRouter);
app.use('/api/users', usersRouter);
app.use('/api/mocking', mockingRouter);
app.use('/api/restorePassword', restorePasswordRouter);
app.use('/api/mailToRestorePassword', mailToRestorePasswordRouter);
app.use('/', viewsRouter);

app.engine("handlebars", handlebars.engine());
//Configure view engine
app.set("view engine", "handlebars");
//configue views folder
app.set("views", __dirname + "/views");


//Instance server to listening app.listen
const server = app.listen(PORT, () => {
    console.log('Server listening at port 8080')
})

//instance socket server
const socketServer = new Server(server);

//instance productsManagers
const productsManager = new ProductsManager();

//instance MessageManager
const messageManager = new MessageManager();

socketServer.on("connection", async (socket) => {

    socket.emit("event_socket", "This message is only for socket");
    socket.broadcast.emit("Event_all_but_current_one", "This message is for everyone except the one making the request");
    socketServer.emit("It_is_received_by_all_clients", "It is received by all clients");
    const products = await productsManager.get();
    socketServer.emit("serverProducts", products);

    socket.on('client:AddProduct', async (data) => {
        await productsManager.add(data);
        console.log(data);
        const updatedProducts = await productsManager.get({}); // Get updated products list
        socketServer.emit('serverProducts', updatedProducts);
    });

    socket.on("client:DeleteProduct", async (id) => {
        console.log("ID del producto a eliminar:", id);
        const deletedProduct = await productsManager.delete(id);
        const updatedProducts = await productsManager.get({});

        console.log(deletedProduct.message);
        socketServer.emit("server:ProductDeletedMessage", deletedProduct);
        socketServer.emit("server:ProductDeleted", updatedProducts);
    });


    socket.on('message', async data => {
        await messageManager.addMessages(data);
        const GetMessages = await messageManager.get();
        console.log(GetMessages)
        socketServer.emit('messageLogs', GetMessages);
    })

})

