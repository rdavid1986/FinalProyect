import { cartsModel } from "../../models/cart.js"

export default class MongoCartManager {
    constructor() {
    }

    getById = async (id) => {
        const cart = await cartsModel.findOne({ _id: id }).lean();
        return cart;
    }
    add = async () => {
        try {
            //Create an empty cart with an empty product array
            const cart = await cartsModel.create({ products: [] });
            return cart;
        } catch (error) {
            console.error("Error to create a cart:", error);
            throw error;
        }
    }
    addToCart = async (cid, pid) => {
        try {
            const data = { _id: cid, 'products._id': pid };
            const cart = await cartsModel.findById(cid);
            const product = cart.products.some((product) => product._id.equals(pid));

            if (product) {
                const update = {
                    $inc: { 'products.$.quantity': 1 }
                };
                await cartsModel.updateOne(data, update);
            } else {
                const update = {
                    $push: {
                        products: { _id: pid, quantity: 1 }
                    }
                };
                await cartsModel.updateOne({ _id: cid }, update);
            }

            return await cartsModel.findById(cid);
        } catch (error) {
            return { oror: error.message };
        }
    };
    deleteFromCart = async (cid, pid) => {
        try {
            const updatedCart = await cartsModel.findByIdAndUpdate(cid, { $pull: { products: { _id: pid } } }, { new: true });
            return updatedCart;
        } catch (error) {
            return { error: error.message };
        }
    };
    updateQuantity = async (cid, pid, quantity) => {
        try {
            await cartsModel.updateOne(
                { _id: cid, 'products._id': pid },
                { $set: { 'products.$.quantity': quantity.quantity } }
            );
        } catch (error) {
            return { error: error.message };
        }
    };
    async update(cid, updateData) {
        try {
            const updatedCart = await cartsModel.findByIdAndUpdate(cid, updateData, { new: true });

            if (!updatedCart) {
                throw new Error('Couldnt find cart to upgrade.');
            }

            return updatedCart;
        } catch (error) {
            console.error('Error to update cart:', error);
            throw error;
        }
    }
    async deleteProducts(cid) {
        try {
            const updatedCart = await cartsModel.findByIdAndUpdate(
                cid,
                {
                    $set: { products: [] }
                },
                { new: true }
            );
            return updatedCart;
        } catch (error) {
            return { error: error.message };
        }
    };
}