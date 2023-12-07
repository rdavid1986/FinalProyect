import mongoose from "mongoose";
import CartsDao from "../src/dao/mongo/cartsManager.js";
import assert from "assert";
import config from "../src/config/config.js";

mongoose.connect(config.mongoUrlTesting);

describe("Testing Carts dao", () => {
    before(function(){
        this.cartsDao = new CartsDao();
    });
    it("This dao carts must return carts", async function(){
        const result = await this.cartsDao.get();
        console.log(this.cartsDao)
        console.log("Is result an array?", Array.isArray(result));
        assert.strictEqual(Array.isArray(result), true);
    });
    it("This dao must add a cart with products array empty", async function(){
        
        const result =  await this.cartsDao.add();
        assert.deepStrictEqual(result.products, []);
    })
    it("This dao must get cart by id", async function(){
        
        const result =  await this.cartsDao.add();
        const id = "656f96e3d5122ebc356f7118"
        const cart = await this.cartsDao.getById(id);
        assert.deepStrictEqual(typeof cart, 'object');
    })
    beforeEach(function () {
        mongoose.connection.collections.carts.drop();
        this.timeout(2000);
    });
});
