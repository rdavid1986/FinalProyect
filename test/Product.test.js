import mongoose from "mongoose";
import products from "../src/dao/mongo/productManager.js";
import assert from "assert";
import config from "../src/config/config.js";

mongoose.connect(config.mongoUrlTesting);

describe("Testing Products dao", () => {
    before(function(){
        this.productsDao = new products();
    });

    it("This dao products must return products", async function(){
        console.log(this.productsDao)
        const result = await this.productsDao.getProducts();
        console.log(this.productsDao)
        console.log("Is result an array?", Array.isArray(result));
        assert.strictEqual(Array.isArray(result), true);
    });
    it("This dao must add a product", async function(){
        const mockProduct = {
            title : "OneProduct",
            description : "OneProduct",
            category : "OneProduct",
            code : "OneProduct",
            price : 100,
            thumbnail : "OneProduct",
            stock : 3,
        }
        const result =  await this.productsDao.add(mockProduct);
        assert.ok(result._id);
    })
    
    it("This dao must add a product with array empty", async function(){
        const mockProduct = {
            title : "OneProduct",
            description : "OneProduct",
            category : "OneProduct",
            code : "OneProduct",
            price : 100,
            thumbnail : [],
            stock : 3,
        }
        const result =  await this.productsDao.add(mockProduct);
        assert.deepStrictEqual(result.thumbnail, []);
    })
    it("This dao must get product by id", async function(){
        const mockProduct = {
            title : "OneProduct",
            description : "OneProduct",
            category : "OneProduct",
            code : "OneProduct",
            price : 100,
            thumbnail : "OneProduct",
            stock : 3,
        }
        const result =  await this.productsDao.add(mockProduct);
        const id = result._id.toString()
        const product = await this.productsDao.getById(id);
        assert.deepStrictEqual(typeof product, 'object');
    })
    beforeEach(function () {
        mongoose.connection.collections.products.drop();
        this.timeout(2000);
    });
});
