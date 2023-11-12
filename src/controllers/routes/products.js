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
    let products = await productManager.get();
    req.logger.warn("alert");
    req.logger.info("status: success")
    res.status(200).send({ status: "success", payload: products })
};
//Create a product /api/products
export const addProduct = async (req, res) => {
    try {
        
        //Create a product
        const productDTO = new productsDTO(req.body)
        const { title, description, category, code, price, stock } = productDTO
        if (!title || !description || !category || !code || !price || !stock) {
            CustomError.createError({
               name: "Product creation error",
               cause: generateProductErrorInfo({ title, description, category, code, price, stock }),
               message: "Error triying to create Product",
               code: EErrors.INVALID_TYPES_ERROR
           })
       }
        const product = await productManager.add(productDTO);
        //responnse
        return res.status(200).send({ status: "success", payload: product });
    } catch (error) {
        return res.send({ status: "error", error:` ${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
//rute /product?limit get limited product list default in 5 products or the amount of you choose
export const paginateProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const products = await productsModel.paginate({}, { limit: limit, page: 1 });
    res.send({ status: "success", payload: products })
};
//Get product by id /api/products/pid
export const getProductsById = async (req, res) => {
    const id = req.params.pid;
    const products = await productManager.getById(id);
    if (products) res.status(200).send({ status: "success", payload: products });
    else res.send(`Error  404 : products not found with id : ${id}`);
};
//Update product /api/products/pid
export const updateProduct = async (req, res) => {
    const id = req.params.pid;
    const updateProduct = req.body;

    const result = await productManager.update(id, updateProduct);
    console.log(id)
    console.log(updateProduct)
    console.log(result);
    return res.send(result);
};
//delete product /api/products/pid
export const deleteProduct = async (req, res) => {
    const id = req.params.pid;

    const deleteProduct = await productManager.delete(id);
    res.send(deleteProduct);
}