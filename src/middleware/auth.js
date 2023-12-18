import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.header("authorization");
    if (!authHeader) {
        return res.status(401).json({ error: "Access Denied, Token Required" })
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied, Token Required" })
    }

    jwt.verify(token, config.privateKey, (error, credentials) => {
        if (error) {
            return res.status(401).json({ error: "invalid token" });
        }

        req.user = credentials.user
        next();
    })
}

export const adminAccess = (req, res, next) => {
    const user = req.body.user || req.session.user || req.body.admin;
    const mockUser = req.body.mockUser

    try {
        if (user.email === "adminCoder@coder.com") {
            next();
        } else if (mockUser.premium === true) {
            next();
        } else if (req.session.user.premium === true) {
            next();
        }

    } catch (error) {
        req.logger.error(`Middleware auth.js line 35 ${error.message}, ${error.code}`);
        res.send({ status: "failed", message: "You are not allowed to access this" });
    }
}
export const userAccess = (req, res, next) => {
    try {
        let role = req.session.user?.role || req.body.user?.role;

        if (role === "user") {
            next();
        } else {
            // Puedes personalizar el mensaje de error según tus necesidades
            res.status(403).send({ status: "failed", message: "You are not allowed to access this" });
        }
    } catch (error) {
        req.logger.error(`Middleware auth.js line 46 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
export const premiumAccess = (req, res, next) => {
    const premium = req.session.user.premium || req.body.premium;
    console.log("premium", premium)
    try {

        if (premium === true) {
            next();
        }
    } catch (error) {
        req.logger.error(`Middleware auth.js line 57 ${error.message}, ${error.code}`);
        res.send({ status: "failed", message: "You are not allowed to access" });
    }

}
export const publicAccess = (req, res, next) => {
    const user = req.session.user || req.body.user;

    try {
        if (user) {
            return res.redirect('/products');
        } else {

        }
        next();
    } catch (error) {
        req.logger.error(`Middleware auth.js line 71 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
export const privateAccess = (req, res, next) => {
    const user = req.session.user || req.body.user;

    try {
        if (!user) {
            return res.status(403).redirect('/');
        }
        next();
    } catch (error) {
        req.logger.error(`Middleware auth.js line 82 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
