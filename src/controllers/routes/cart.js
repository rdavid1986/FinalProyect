import CartsManager from "../../dao/mongo/cartsManager.js";
import ProductManager from "../../dao/mongo/productManager.js";
import { ticketModel } from "../../models/ticket.js";
import nodemailer from "nodemailer";
import config from "../../config/config.js";
import { userModel } from "../../models/user.js";

const cartsManager = new CartsManager();
const productManager = new ProductManager();
//init transport
const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: config.transportUser,
        pass: config.mailerPass
    }
});
//Route to create a new cart
export const addCart = async (req, res) => {
    try {
        const newCart = await cartsManager.add();
        res.send({ status: "success cart added", payload: newCart })
    } catch (error) {
        req.logger.error(`Controller cart addCart ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
//Get al carts
export const getCarts = async (req, res) => {
    try {
        const carts = await cartsManager.get();

        if (carts.length === 0) {
            res.status(404).send({
                status: 'error',
                message: 'Array carts is empty'
            });
            return;
        }
        res.status(200).send(carts);
    } catch (error) {
        req.logger.error(`Controller cart getCarts ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
//Route to get a cart by id
export const getCartById = async (req, res) => {
    try {
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
    } catch (error) {
        req.logger.error(`Controller carts getCartById ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
export const addProductToCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const user = req.session.user || req.body.user;
        
        const product = await productManager.getById(pid);
        const cart = await cartsManager.getById(cid);

        if (!product) {
            return res.status(404).send({ status: 'error', message: `The product with ID ${pid} doesn't exist` });
        }
        if (!cart) {
            return res.status(404).send({ status: 'error', message: `The cart with ID ${cid} doesn't exist` });
        }
        if (user.premium === true && product.owner === user._id) {
            return res.status(401).send({ status: "error", message: "You can't add your own product to your cart" });
        }
        if (user.role === "admin") {
            return res.status(401).send({ status: "error", message: "You can't add a product to if you are admin" });
        }

        const addProduct = await cartsManager.addToCart(cid, pid);
        return res.status(200).send({status: "success", message: 'Product successfully added to cart', payload: addProduct});
    } catch (error) {
        req.logger.error(`Controller cart addProductToCart ${error.message}, ${error.code}`);
        return res.status(500).send({
            status: "error",
            error: `${error.name}: ${error.cause},${error.message},${error.code}`
        });
    }
};
//Rute to delete a cart
export const deleteProducts = async (req, res) => {
    try {
        const cid = req.params.cid;
        const deleteCart = await cartsManager.deleteProducts(cid);
        return res.status(200).send({ status: "success ", payload: deleteCart });
    } catch (error) {
        req.logger.error(`Controller carts deleteProducts ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
//rute to delete product in a cart
export const deleteProductFromCart = async (req, res) => {
    try {
        const cid = req.params.cid || req.body.cid;
        const pid = req.params.pid || req.body.pid;
        const user = req.session.user || req.body.user;
        
        await cartsManager.deleteFromCart(cid, pid);
        return res.status(200).send({ status: "success", message: "Product delete fron this cart" });
        
    } catch (error) {
        req.logger.error(`Controller carts deleteProductFromCart ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
//Rute to update a product in cart
export const updateQuantityProductInCart = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cid = req.params.cid;
        const pid = req.params.pid;
        const updateProductInCart = await cartsManager.updateQuantity(cid, pid, quantity);
        return res.send({ status: "success Product update fron this cart", payload: updateProductInCart });
    } catch (error) {
        req.logger.error(`Controller carts line 138 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
}
export const purchase = async (req, res) => {
    try {
        const cid = req.params.cid;
        const mail = req.session.user.email;
        const cart = await cartsManager.getById(cid);

        if (!cart) return res.status(404).json({ error: 'Cart doesnt exist' });


        const products = cart.products;
        if (cart.products.length > 0) {
            const productsToPurchase = [];
            const productsNotPurchased = [];
            let totalPricePurchase = 0;
            for (let product of products) {
                const productInfo = await productManager.getById(product._id);

                if (productInfo.stock >= product.quantity) {
                    const updatedStock = productInfo.stock - product.quantity;
                    if (updatedStock <= 0) {
                        updatedStock = 0
                        //update stock
                        await productManager.update(product._id._id, { stock: updatedStock });
                    } else {
                        //update stock
                        await productManager.update(product._id._id, { stock: updatedStock });
                    }
                    //delete product from cart
                    await cartsManager.deleteFromCart(cid, product._id._id);
                    const totalPrice = product._id.price * product.quantity
                    productsToPurchase.push(` ${product._id.title} x ${product.quantity} = ${totalPrice} `);
                    totalPricePurchase += totalPrice
                } else {
                    productsNotPurchased.push(`${product._id.title} x ${product.quantity}`);
                }
            }
            const ticket = {
                code: Date.now().toString().replace(/\D/g, '') + Math.random().toString().slice(2, 8),
                products: productsToPurchase,
                amount: totalPricePurchase,
                purchaser: mail
            }
            console.log("ticket", ticket);

            ticketModel.create(ticket)
            delete ticket.code
            setTimeout(function () {
                res.status(200).render('purchase',
                    { payload: ticket, style: "purchase.css" }
                );
            }, 1300);
            try {
    
                let result = await transport.sendMail({
                    from: "eccommercer coder proyect<r.david1923@gmail.com>",
                    to: mail,
                    subject: "Eccommercer buy",
                    html: `
                    <h1>Thanks for your purchase</h1>
                    <p>This is the list of products you bought</p>
                    ${productsToPurchase}<br>
                    <p>total $ ${totalPricePurchase}</p>
                    `
                })
                req.logger.info("mail sending success");
            } catch (error) {
                req.logger.error("error sending nodemailer", error);
    
            }
        }else{
            res.status(400).render('errorPurchase',
                    { payload: `You can't check out if your cart is empty`, style: "purchase.css" }
                );
        }

    } catch (error) {
        req.logger.error(`Controller carts updateQuantityProductInCart ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }

}
