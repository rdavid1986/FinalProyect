import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import CartsDao from "../src/dao/mongo/cartsManager.js";

const cartsDao = new CartsDao();

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Eccomerce test", () => {
    let pid;
    //User to test sessions endpoints
    const user = {
        email: "adminCoder@coder.com",
        premium: "true",
        role: "user",
        _id: "1234"
    }
    describe("Add products test", () => {
        it("This endpoint POST /api/products must be create product ", async () => {
            const mockProduct = {
                title: "OneProduct",
                description: "OneProduct",
                category: "OneProduct",
                code: "1123fe",
                price: 100,
                thumbnail: "OneProduct",
                stock: 3,
                owner: "true"
            };

            const { statusCode, ok, body } = await requester.post('/api/products').send({ mockProduct, user });


            pid = body.payload._id

            expect(body.payload).to.have.property("_id");
        })
    })
    describe("Update product test", () => {

        it("This endpoint update a product /api/products must be update products", async () => {
            const mockProduct = {
                title: "OtherProduct",
                description: "OtherProduct",
                category: "OtherProduct",
                code: "1123fe",
                price: 100,
                stock: 10,
            };
            const { statusCode, ok, body } = await requester.put(`/api/products/${pid}`).send({ mockProduct });

        }).timeout(4000);

    });
    describe("Delete product test", () => {

        it("This endpoint DELETE a product /api/products must be delete a product", async () => {
            const { statusCode, ok, body } = await requester.delete(`/api/products/${pid}`).send({ user });
        }).timeout(4000)
    });
    let cid;
    
    describe("Add cart superTest", () => {
        it("This endpoint POST /api/carts must be create cart ", async () => {

            const { statusCode, ok, body } = await requester.post('/api/carts');;
            cid = body.payload._id

            expect(body.payload).to.have.property("_id");
        })
    })
    const productToCart = "653c09bfeb2833402b86da6b";
    const cartToAddProduct = "656f96e3d5122ebc356f7118";
    it("This endpoint POST /api/carts/:cid/product/:pid must be add a product to cart ", async () => {
        const { statusCode, ok, body } = await requester.post(`/api/carts/${cartToAddProduct}/product/${productToCart}`).send({ user });
        expect(statusCode).to.equal(200);
    })
    it("This endpoint DELETE /api/carts/:cid/products/:pid must be delete a product to cart ", async () => {
        const { statusCode, ok, body } = await requester.delete(`/api/carts/${cartToAddProduct}/products/${productToCart}`).send({ user });
        expect(statusCode).to.equal(200);
    })
    describe("Delete cart superTest", () => {
        it("This endpoint DELETE a cart /api/products must be cart", async () => {
            const { statusCode, ok, body } = await requester.delete(`/api/carts/${cid}`).send({ user });
        }).timeout(4000)
    });

    // To run this superTest  
    /* ./node_modules/.bin/mocha ./test/superTest.test.js */
})