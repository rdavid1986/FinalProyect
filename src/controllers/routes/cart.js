import CartsManager from "../../dao/mongo/cartsManager.js";
import ProductManager from "../../dao/mongo/productManager.js";
import { ticketModel } from "../../models/ticket.js";
import nodemailer from "nodemailer";
import config from "../../config/config.js";

const cartsManager = new CartsManager();
const productManager = new ProductManager();
//init transport
const transport = nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
        user:config.TRANSPORTUSER,
        pass:"liyg weqi dpux duuu"
    }
});
//Route to create a new cart
export const addCart = async (req, res) => {
    try {
        const newCart = await cartsManager.add();
        res.send({ status: "success cart added", payload: newCart })
    } catch (error) {
        res.send({ status: "error", payload: error })
    }

};
//Get al carts
export const getCarts = async (req, res) => {
    const carts = await cartsManager.get();

    if (carts.length === 0) {
        res.status(404).send({
            status: 'error',
            message: 'Array carts is empty'
        });
        return;
    }
    res.status(200).send(carts);
};
//Route to get a cart by id
export const getCartById = async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartsManager.getById(cid);

    if (!cart) {
        res.status(404).send({
            status: 'error',
            message: `This cart id doesnt exist ${cid}`
        });
    } else if (cart.products.length === 0) {
        res.send('Cart is empty');
    } else {
        res.status(200).send(cart);
    }
};
//Route to create a new product in a cart
export const addProductToCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const product = await productManager.getById(pid);
    const cart = await cartsManager.getById(cid);
    if (!product) {
        res.status(404).send({
            status: 'error',
            message: `The product with that ID: ${pid} doesnt exist`
        });
        return;
    }

    if (!cart) {
        res.status(404).send({
            status: 'error',
            message: `The cart with that ID: ${cid} doesnt exist`
        });
        return;
    }
    const addProduct = await cartsManager.addToCart(cid, pid);

    return res.status(200).send({ status: `success products added to cart ${cid}`, payload: addProduct });
};
//Rute to delete a cart
export const deleteProducts = async (req, res) => {
    const cid = req.params.cid;
    const deleteCart = await cartsManager.deleteProducts(cid);
    console.log("cid", cid)
    return res.status(200).send({ status: "success ", payload: deleteCart });
};
//rute to delete product in a cart
export const deleteProductFromCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const deleteProductInCart = await cartsManager.deleteFromCart(cid, pid);
    return res.status(200).send({ status: "success Product delete fron this cart", payload: deleteProductInCart });
};
//Rute to update a product in cart
export const updateQuantityProductInCart = async (req, res) => {
    const { quantity } = req.body;
    const cid = req.params.cid;
    const pid = req.params.pid;
    const updateProductInCart = await cartsManager.updateQuantity(cid, pid, quantity);
    return res.send({ status: "success Product update fron this cart", payload: updateProductInCart });
}
export const purchase = async (req, res) => {
    const cid = req.params.cid;
    const mail = req.session.user.email;
    const cart = await cartsManager.getById(cid);

    if (!cart) return res.status(404).json({ error: 'Cart doesnt exist' });
    

    const products = cart.products;
    const productsToPurchase = [];
    const productsNotPurchased = [];
    let totalPricePurchase = 0;
    for (const product of products) {
        const productInfo = await productManager.getById(product._id);
        
        if (productInfo.stock >= product.quantity) {
            const updatedStock = productInfo.stock - product.quantity;
            console.log("updatedStock",updatedStock)
            if(updatedStock <= 0){
                updatedStock = 0
                //update stock
                await productManager.update(product._id._id, { stock: updatedStock });
            }else{
                //update stock
                 await productManager.update(product._id._id, { stock: updatedStock });
            }
            //delete product from cart
            await cartsManager.deleteFromCart(cid, product._id._id);
            const totalPrice = product._id.price * product.quantity
            productsToPurchase.push(`${product._id.title} x ${product.quantity} = ${totalPrice}`);
            totalPricePurchase += totalPrice
            console.log("totalPrice",totalPrice)
        } else {
            productsNotPurchased.push(`${product._id.title} x ${product.quantity}`);
        }
    }
    const ticket = {
        code: Date.now().toString().replace(/\D/g, '') + Math.random().toString().slice(2, 8),
        amount: totalPricePurchase,
        purchaser: mail
    }
    console.log("ticket",ticket);

    ticketModel.create(ticket)

    res.status(200).send({status: "succes", payload: productsToPurchase, totalPricePurchase, productsNotPurchased });
    try {
        
        let result = await transport.sendMail({
            from: "eccommercer coder proyect<r.david1923@gmail.com>",
            to: mail,
            subject:"Eccommercer buy",
            html:`
            <h1>Thanks for your purchase</h1>
            <p>This is the list of products you bought</p>
            ${productsToPurchase}
            <p>total $ ${totalPricePurchase}</p>
            `
        })
        console.log("this is result in mail of purchaser", result);
    } catch (error) {
        console.log("error sendi nodemailer", error);
        
    }

}
