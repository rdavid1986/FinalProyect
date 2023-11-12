import ProductDTO from '../dao/DTOs/products.js';
export default class ProductRepository {
    constructor(dao){
        this.dao = dao;
    }

    getProducts = async ()=> {
        const result = await this.dao.get();
        return result;
    }

    createProduct = async(product) => {
        let newProduct = new ProductDTO(product);
        const result = await this.dao.create(newProduct);
        return result;
    }
}