import chai from "chai";
import supertest from "supertest";
import CartsDao from "../src/dao/mongo/cartsManager.js";
import { userModel } from "../src/models/user.js";

const cartsDao = new CartsDao();

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Eccomerce superTest", () => {
    //User to test endpoints
    const user = {
        first_name: "superTest",
        last_name: "superTest",
        email: "adminCoder@coder.com",
        premium: "true",
        role: "user",
        _id: "1234"
    }
    const admin = {
        email: "adminCoder@coder.com",
        role: "admin"
    }
    const mockUser = {
        first_name: "coder supertest",
        last_name: "House supertest",
        age: 37,
        email: "correo@supertest.com",
        password: "123"
    }
    const productToCart = "653c09bfeb2833402b86da6b";
    const cartToAddProduct = "656f96e3d5122ebc356f7118";
    let pid;
    let cid;
    describe("Add products superTest", () => {
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
    describe("Update product superTest", () => {

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
    describe("Delete product superTest", () => {

        it("This endpoint DELETE a product /api/products must be delete a product", async () => {
            const { statusCode, ok, body } = await requester.delete(`/api/products/${pid}`).send({ user });
        }).timeout(4000)
    });
    describe("Add cart superTest", () => {
        it("This endpoint POST /api/carts must be create cart ", async () => {

            const { statusCode, ok, body } = await requester.post('/api/carts');;
            cid = body.payload._id

            expect(body.payload).to.have.property("_id");
        })
    })
    describe("Add a product to cart superTest", () => {
        it("This endpoint POST /api/carts/:cid/product/:pid must add a product to cart", async () => {
            const response = await requester.post(`/api/carts/${cartToAddProduct}/product/${productToCart}`).send({ user });

            expect(response.status).to.equal(200);

            expect(response.body).to.have.property("status").that.equals("success");
            expect(response.body).to.have.property("payload");
        });
    });
    describe("Delete product in a cart superTest", () => {
        it("This endpoint DELETE /api/carts/:cid/products/:pid must be delete a product to cart ", async () => {
            const { statusCode, ok, body } = await requester.delete(`/api/carts/${cartToAddProduct}/products/${productToCart}`).send({ user });
            expect(statusCode).to.equal(200);
        })
    });
    describe("Delete cart superTest", () => {
        it("This endpoint DELETE a cart /api/products must be delete a cart", async () => {
            const { statusCode, ok, body } = await requester.delete(`/api/carts/${cid}`).send({ user });
        })
    });
    describe("Resgister user session on superTest", () => {
        it("Register user /api/session/register", async function () {
            const { statusCode, ok, body } = await requester.post(`/api/session/register`).send({
                first_name: "coder supertest",
                last_name: "House supertest",
                age: 37,
                email: "correo@supertest.com",
                password: "123"
            });
            expect(statusCode).to.equal(200);
            expect(body).to.have.property("status").that.equals("success");
        })
    })
    describe("Current user session superTest", () => {
        it("Current user /api/session/current", async function () {
            const { statusCode, ok, body } = await requester.get(`/api/session/current`).send({ user });
            expect(statusCode).to.equal(200);
            console.log(body)
        })
    })
    describe("Delete user in sessions", () => {
        it("Delete user /api/session/delete must delete an user in database", async function () {
            const { statusCode, ok, body } = await requester.delete(`/api/session/delete`).send({ mockUser, admin });
            expect(statusCode).to.equal(200);
        })
    })
    // To run this superTest  
    /* ./node_modules/.bin/mocha ./test/superTest.test.js */
})