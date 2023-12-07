import ProductManager from "../../dao/mongo/productManager.js";
import { productsModel } from "../../models/product.js";
import productsDTO from "../../dao/DTOs/products.js";
import { generateProductErrorInfo } from "../../services/errors/info.js";
import CustomError from "../../services/errors/CustomError.js";
import EErrors from "../../services/errors/enums.js";

//We create the instance of the class
const productManager = new ProductManager();
//Get products /api/products
export const getProducts = async (req, res) => {
    try {
        let products = await productManager.get();
        res.status(200).send({ status: "success", payload: products })
    } catch (error) {
        req.logger.error(`Controller products line 16 ${error.message}, ${error.code}`);
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
            //This is for supertest
            const productDTO = new productsDTO(mockProduct, mockUser);
            const productAdded = await productManager.add(productDTO);
            return res.status(200).send({ status: "success", payload: productAdded });
        } else {
            const productDTO = new productsDTO(req.body, user);
            let { title, description, category, code, price, stock } = productDTO
            if (!title || !description || !category || !code || !price || !stock) {
                CustomError.createError({
                    name: "Product creation error",
                    cause: generateProductErrorInfo({ title, description, category, code, price, stock }),
                    message: "Error triying to create Product",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }
            const productAdded = await productManager.add(productDTO);
            return res.status(200).send({ status: "success", payload: productAdded });
        }
    } catch (error) {
        req.logger.error(`controller products line 46  ${error.message}, ${error.code}`);
        return res.send({ status: "error", error: ` ${error.name}: ${error.cause},${error.message},${error.code}` });
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
        req.logger.error(`Controller products line 54 ${error.message}, ${error.code}`);
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
        req.logger.error(`Controller products line 70 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};

//delete product /api/products/pid
export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.pid;
        const user = req.session.user;
        const mockUser =  req.body.user;
        const premium = mockUser.premium || user.premium;
        const userId = mockUser._id || user._id;
        if (premium === "true") {
            const products = await productsModel.find();

            const userProducts = products.filter(product => product.owner === userId);
            const productToDelete = userProducts.find(product => product._id.toString() === id);

            if (productToDelete) {
                await productManager.delete(productToDelete._id.toString());
                res.status(200).send({ status: "success", message: "product deleted" });
            } else if (!productToDelete) {
                res.status(200).send({ error: "error", message: "Product with that id dosnt exist" });
            }
        } else {
            await productManager.delete(id);
            res.status(200).send({ status: "success", message: "product deleted" });
        }

    } catch (error) {
        req.logger.error(`controller products line 100  ${error.message}, ${error.code}`);
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
        req.logger.error(`Controller products line 112 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};