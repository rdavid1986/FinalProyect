import ProductManager from "../../dao/mongo/productManager.js";
import { productsModel } from "../../models/product.js";
import { userModel } from "../../models/user.js";
import productsDTO from "../../dao/DTOs/products.js";
import { generateProductErrorInfo } from "../../services/errors/info.js";
import CustomError from "../../services/errors/CustomError.js";
import EErrors from "../../services/errors/enums.js";
import path from "path";
import __dirname from "../../utils.js"
import config from "../../config/config.js";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: config.transportUser,
        pass: "liyg weqi dpux duuu"
    }
});
//We create the instance of the class
const productManager = new ProductManager();
//Get products /api/products
export const getProducts = async (req, res) => {
    try {
        let products = await productManager.get();
        res.status(200).send({ status: "success", payload: products })
    } catch (error) {
        req.logger.error(`Controller products getProducts ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
//Create a product /api/products
export const addProduct = async (req, res) => {
    const user = req.session.user;
    const mockUser = req.body.user; //For supertest con sessions
    const mockProduct = req.body.mockProduct; //For supertest con sessions

    try {
        if (!user) {
            // This is for supertest
            const productDTO = new productsDTO(mockProduct, mockUser);
            const productAdded = await productManager.add(productDTO);
            return res.status(200).send({ status: "success", payload: productAdded });
        } else {
            console.log("esto se envio", req.body);

            let { title, description, category, code, price, stock, thumbnail } = req.body;

            if (typeof price === "string" && typeof stock === "string") {
                price = +price;
                stock = +stock;
            }
            if (req.files) {
                thumbnail = req.files.map((file) => {
                    return path.join(__dirname, '/public/products/', file.filename);
                });
            }
            console.log("asi quedo ", title, description, category, code, price, stock, thumbnail);

            if (!title || !description || !category || !code || !price || !stock || !thumbnail) {
                CustomError.createError({
                    name: "Product creation error",
                    cause: generateProductErrorInfo({ title, description, category, code, price, stock, thumbnail }),
                    message: "Error trying to create Product",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            const productDTO = new productsDTO({ title, description, category, code, price, stock, thumbnail }, user);
            const productAdded = await productManager.add(productDTO);

            return res.status(200).send({ status: "success", payload: productAdded });
        }
    } catch (error) {
        req.logger.error(`controller products addProduct  ${error.message}, ${error.code}`);
        return res.status(500).send({ status: "error", error: ` ${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
//Get product by id /api/products/pid
export const getProductsById = async (req, res) => {
    try {
        const id = req.params.pid;
        const products = await productManager.getById(id);
        if (products) {
            res.status(200).send({ status: "success", payload: products });
        } else {
            req.logger.error("error");
            res.send(`Error  404 : products not found with id : ${id}`);
        }
    } catch (error) {
        req.logger.error(`Controller products getProductsById ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
//Update product /api/products/pid
export const updateProduct = async (req, res) => {
    try {
        const id = req.params.pid;
        const updateProduct = req.body;

        const result = await productManager.update(id, updateProduct);
        return res.send(result);
    } catch (error) {
        req.logger.error(`Controller products updateProduct ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
//delete product /api/products/pid
export const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        const user = req.session.user;
        const mockUser = req.body.user;

        const product = await productManager.getById(pid);
        console.log("product by id title",product.title);
        if(product.owner){
            const productOwner = await userModel.findOne({ _id: product.owner });
            console.log("this is user owneer",productOwner.email)

            let result = await transport.sendMail({
                from: "eccommercer coder proyect<r.david1923@gmail.com>",
                to: productOwner.email,
                subject: "Eccommercer message",
                html: `
                        <h1>Your product ${product.title} has been deleted</h1>
                        <p>Thanks for using our app</p>
                        `
            });
            await productManager.delete(pid);
            res.status(200).send({ status: "success", message: "product deleted" });
        }else {
            await productManager.delete(pid);
            res.status(200).send({ error: "success", message: "product deleted" });
        } 

    } catch (error) {
        req.logger.error(`controller products deleteProduct  ${error.message}, ${error.code}`);
        return res.send({ status: "error", error: ` ${error.name}: ${error.cause},${error.message},${error.code}` });
    }
}
//rute /product?limit get limited product list default in 5 products or the amount of you choose
export const paginateProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const products = await productsModel.paginate({}, { limit: limit, page: 1 });
        res.status(200).send({ status: "success", payload: products })
    } catch (error) {
        req.logger.error(`Controller products paginateProducts ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};