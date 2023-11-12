import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
   
    products: {
        type:[
            {
                _id:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity:{
                    type: Number,
                    default:1
                }
                    
            }
        ],
        default:[]
    }
});
cartsSchema.pre("findOne", function (next) {
    this.populate("products._id");
    next();
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);