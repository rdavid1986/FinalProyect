import mongoose from "mongoose";
import CartsDao from "../src/dao/mongo/cartsManager.js";
import chai from "chai";
import config from "../src/config/config.js";

mongoose.connect(config.mongoUrlTesting);

const expect = chai.expect;

describe("Chai testing carts dao", () => {
    before(function() {
        this.cartsDao = new CartsDao();
    });
    it("This dao carts must return carts", async function() {
        console.log(this.cartsDao)
        const result = await this.cartsDao.get();
        console.log("Is result an array?", Array.isArray(result));
        expect(Array.isArray(result)).to.be.ok;
    });
    it("This dao must add a cart", async function(){
        const result =  await this.cartsDao.add();
        expect(result).to.have.property("_id");
    });
    it("This dao must add a cart with products array empty", async function(){
        const result =  await this.cartsDao.add();
        expect(result.products).to.be.deep.equals([]);
    });
    it("This dao must get cart by id", async function(){
        
        const result =  await this.cartsDao.add();
        const id = result._id.toString()
        const cart = await this.cartsDao.getById(id);
        expect(typeof cart).to.be.equals('object');
    });
    beforeEach(function () {
        mongoose.connection.collections.carts.drop();
        this.timeout(2000);
    });
})