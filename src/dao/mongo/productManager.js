import { productsModel } from "../../models/product.js";



export default class MongoProductManager {
    constructor() {
    }
    // Get all products from the database
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
    add = async (product) => {
        const { title, description, category, code, price, stock, thumbnail } = product;
        console.log("Product added" , title, description, category, code, price, stock, thumbnail);
            
            // Create a new product in the database
            await productsModel.create({ title, description, category, code, price, stock, thumbnail });
            console.log("Product added" , product);
    }
    // Get product by ID
    async getById(id) {
        const result = { status: "failed", message: "" }
        const searchById = productsModel.findById(id);
        if (searchById) {
            result.status = "succes";
            result.message = `This is the products search by id ${id}`
            return result, searchById;
        } else {
            console.log(` ---------------- Product with id : ${id} not found ---------------- `);
            result.status = "failed";
            result.message = `Product with id : ${id} not found`
            console.log(`Product with id : ${id} not found`)
            return result;
        }
    }
    // update a product
    async update(id, updateProductData) {
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
            console.log("error al updatear")
            return result;
        }
    }
    //delete a product
    async delete(id) {
        const filter = { _id: id };
        try {
            // Delete the product from the database
            await productsModel.deleteOne(filter);
            const result = { status: "success", message: "product deleted successfully" }
            return result
        } catch (error) {
            console.log("error deleting product");
        }

    };
}