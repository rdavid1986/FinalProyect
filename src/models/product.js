import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        require:true,
    },
    description: {
        type: String,
        require:true,
    },
    code: {
        type: String,
        require:true,
        unique:true
    },
    stock: {
        type: Number,
        require:true,
    },
    category: {
        type: String,
        require:true,
    },
    price: {
        type: Number,
        require:true,
    },
    thumbnail: {
        type: Array,
        default: [],
    },
    status: {
        type: Boolean, 
        default: true,
    },
    active: Boolean
});
 
productSchema.index({ title: 'text', description: 'text', category: 'text' });

productSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(productsCollection, productSchema);