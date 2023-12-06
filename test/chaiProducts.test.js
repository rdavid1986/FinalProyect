import mongoose from "mongoose";
import Products from "../src/dao/mongo/productManager.js";
import chai from "chai";
import config from "../src/config/config.js";

mongoose.connect(config.mongoUrlTesting);

const expect = chai.expect;

describe("Chai testing Products dao", () => {
    before(function() {
        this.productsDao = new Products();
    })
    beforeEach(function() {
        mongoose.connection.collections.products.drop();
        this.timeout(3000);
    })
    it("This dao products must return products", async function() {
        console.log(this.productsDao)
        const mockProduct = {
            title : "OneProduct",
            description : "OneProduct",
            category : "OneProduct",
            code : "OneProduct",
            price : 100,
            thumbnail : [],
            stock : 3,
        }
        await this.productsDao.add(mockProduct);
        const result = await this.productsDao.getProducts();
        expect(result).to.be.deep.equal([])
        expect(result).deep.equal([]);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.equals(true);
    })
    it("This dao must add a product", async function(){
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
        expect(result).to.have.property("_id");
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
        expect(result.thumbnail).to.be.deep.equals([]);
    })
    it("This dao must get product by id", async function(){
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
        const id = result._id.toString()
        const product = await this.productsDao.getById(id);
        expect(typeof product).to.be.equals('object');
    })
    beforeEach(function () {
        mongoose.connection.collections.products.drop();
        this.timeout(2000);
    });
})