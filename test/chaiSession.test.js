import mongoose from "mongoose";
import chai from "chai";
import config from "../src/config/config.js";
import {createHash} from "../src/utils.js";
import { userModel } from "../src/models/user.js";

mongoose.connect(config.mongoUrlTesting);

const expect = chai.expect;

describe("Chai testing sessions model", () => {
    beforeEach(function() {
        mongoose.connection.collections.users.drop();
        this.timeout(3000);
    })
    it("This dao must add a user", async function(){
        const mockUser = {
            first_name: "coder",
            last_name: "House",
            email: "correo@correo.com",
            password: "123"
        }
        let result = await userModel.create(mockUser);
        expect(result).to.have.property("_id");
    })
    it("This dao sessions must return user by email", async function() {
        const userEmail = "correo@correo.com";
        const user = await userModel.findOne({ email: userEmail });
        expect(typeof user).to.be.equals('object')
    })
    it("This dao must compare password and hashPassword", async function(){
        const mockUser = {
            first_name: "coder",
            last_name: "House",
            email: "correo@correo.com",
            password: "123"
        }
        const passwordHash = createHash(mockUser.password);
        expect(mockUser.password).to.be.not.equals(passwordHash);
    })
    beforeEach(function () {
        this.timeout(2000);
    });
})