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
        type: Boolean,
        default: false,
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
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ],
        default: [],
    },
    status: {
        type: Boolean,
        default: false,
    },
    last_connection: String,
    active: Boolean,
    recoverToken: String,
})
userSchema.pre("find", function (next) {
    this.populate("cart");
    next();
});

export const userModel = mongoose.model(collection, userSchema)