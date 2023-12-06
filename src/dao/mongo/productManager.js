import { productsModel } from "../../models/product.js";
import productDTO from "../DTOs/products.js";



export default class MongoProductManager {
    constructor() {
    }
    // Get all products from the database
    getProducts = async () => {
        try {
            const products = await productsModel.find();
            return products
        } catch (error) {
            throw error ; 
        }
    }
    get = async (limit, page, sortOptions, category) => {
        try {
            const filter = {};
            if (category) {
                filter.$text = { $search: category };
            }
    
            const options = {
                limit: limit,
                page: page,
                sort: sortOptions
            };
            const result = await productsModel.paginate(filter, options);
            
            return result;
        } catch (error) {
            console.error("Error al leer productos", error);
            throw error;
        }
    }
    // Add a new product to the database
    add = async (productDTO) => {
        const { title, description, category, code, price, stock, thumbnail, owner} = productDTO;
        const result = await productsModel.create({ title, description, category, code, price, stock, thumbnail, owner});
        return result;
    }
    // Get product by ID
     getById = async (id) => {
        const result = { status: "failed", message: "" }
        const searchById = productsModel.findById(id);
        if (searchById) {
            result.status = "succes";
            result.message = `This is the products search by id ${id}`
            return result, searchById;
        } else {
            result.status = "failed";
            result.message = `Product with id : ${id} not found`
            return result;
        }
    }
    // update a product
    update= async(id, updateProductData) => {
        try {
            const filter = { _id: id };
            const actualizacion = {
                $set: updateProductData
            }
            // Update the product in database
            await productsModel.updateOne(filter, actualizacion);

            return { status: "success", message: "product updated successfully" };
        } catch (error) {
            const result = { status: "failed", message: "failed to update product" }
            return result;
        }
    }
    //delete a product
    delete = async(id) => {
        const filter = { _id: id };

        try {
            // Delete the product from the database
            await productsModel.deleteOne(filter);
            const result = { status: "success", message: "product deleted successfully" }
            return result
        } catch (error) {
            console.log("error deleting product productmanager line 75", error);
        }

    };
}