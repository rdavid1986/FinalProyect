import mongoose from "mongoose";

const collection = 'users';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    full_name: String,
    email: {
        type: String,
        unique: true,
    },
    age: Number,
    userName: String, 
    password: String, 
    role: String,
    premium: {
        type: String,
        default: "false",
    }, 
    cart: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            }
        ],
        default: []
    },
    active: Boolean,
    recoverToken: String,
})
userSchema.pre("find", function (next) {
    this.populate("cart._id");
    next();
});

export const userModel = mongoose.model(collection, userSchema)