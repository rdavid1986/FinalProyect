import mongoose from "mongoose";
import assert from "assert";
import config from "../src/config/config.js";
import {createHash} from "../src/utils.js";
import { userModel } from "../src/models/user.js";


mongoose.connect(config.mongoUrlTesting);

describe("Testing sessions model", () => {
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
        assert.ok(result._id);
    })
    it("This dao sessions must return user by email", async function() {
        const mockUser = {
            first_name: "coder",
            last_name: "House",
            email: "correo@correo.com",
            password: "123"
        }
        let result = await userModel.create(mockUser);
        const user = await userModel.findOne({ email: mockUser.email });
        assert.deepStrictEqual(typeof user, 'object');
    })
    it("This dao must compare password and hashPassword", async function(){
        const mockUser = {
            first_name: "coder",
            last_name: "House",
            email: "correo@correo.com",
            password: "123"
        }
        const passwordHash = createHash(mockUser.password);
        assert.notStrictEqual(mockUser.password, passwordHash);
    })
    beforeEach(function () {
        this.timeout(2000);
    });
})