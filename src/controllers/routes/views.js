import ProductsManager from "../../dao/mongo/productManager.js";
import {cartsModel} from "../../models/cart.js";

const productsManager = new ProductsManager();


export const products = async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    let sorting = req.query.sort || 1;
    const category = req.query.category;

    let sortOptions = {};
    if (sorting === "asc") {
        sortOptions = { price: 1 };
    } else if (sorting === "desc") {
        sortOptions = { price: -1 };
    }
    try {
        const result = await productsManager.get(limit, page, sortOptions, category);
        const modifiedDocs = result.docs.map((product) => ({
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            id: product.id,
            user: req.session.user,
            cart: req.session.user.cart,
        }));
    
        res.render("products", {
            style: "products.css",
            status: "success",
            docs: modifiedDocs,
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            page: result.page,
            pagingCounter: result.pagingCounter,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            user: req.session.user,
            cart: req.session.user.cart,
        });
    } catch (error) {
        req.logger.error(`Controller views line 50 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
    
};
export const realtimeProducts = (req, res) => {
    res.render("realTimeProducts", { style: "realTimeProducts.css" });
};
export const chat = async (req, res) => {
    res.render("chat", {
        style: "chat.css",
    })
};
export const cart = async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartsModel.findById(cid).populate('products._id').lean();
    const products = cart.products;
    const quantity = cart.quantity;
    res.render("carts", {
        style: "realTimeProducts.css", products: products,
        quantity: quantity, cart: cid
    });
};
export const login = (req, res) => {
    res.render('login', { style: "login.css" });
}
export const register = (req, res) => {
    res.render('register', { style: "register.css" })
};
export const profile = (req, res) => {
    res.render('profile', {
        style: "profile.css",
        user : {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            premium: req.user.premium,
            cart: req.user.cart,
            role: req.user.role,
            documents: req.user.documents,
        }
    });
};
export const resetPassword = (req, res) => {
    res.render('resetPassword', { style: "reset.css" })
};
export const notFound = (req, res) => {
    res.render("404")
};
export const recoverView = (req, res) => {
    res.render('mailToRestorePassword', { style: "restorePassword.css" });
}
export const restorePassword = (req, res) => {
    res.render('restorePassword', { style: "restorePassword.css" });
}
