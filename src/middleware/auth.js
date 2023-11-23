import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const verifyToken = (req,res,next) => {
    const authHeader = req.header("authorization");
    if(!authHeader) {
        return res.status(401).json({ error: "Access Denied, Token Required"})
    }

    const token = authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({error: "Access Denied, Token Required"})
    }

    jwt.verify(token, config.privateKey, (error, credentials) => {
        if (error) {
            return res.status(401).json({error: "invalid token"});
        }

        req.user = credentials.user
        next();
    })
}

export const adminAccess = (req, res, next) => {
    if (req.session.user.email === "adminCoder@coder.com") {
        console.log("admin access1 si")
        next();
    }else if (req.session.user.premium === "true"){
        console.log("premium access2 premium si")
        next();
    }else{
        console.log("admin access no")
        res.send({status:"failed", message: "You are not allowed to access this"});
    }
}
export const userAccess = (req, res, next) => {
    if (req.session.user.role === "user") {
        next();
    }else{
        res.send({status:"failed", message: "You are not allowed to access this"});
    }
};
export const premiumAccess = (req, res, next) => {
    if (req.session.user.premium === "true") {
        next();
    }else{
        res.send({status:"failed", message: "You are not allowed to access"});
    }
    
}