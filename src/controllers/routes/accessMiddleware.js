
export const adminAccess = (req, res, next) => {
    if (req.session.user.email === "adminCoder@coder.com") {
        next();
    }else if (req.session.user.premium === true){
        next();
    }
    else{
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
export const publicAccess = (req, res, next) => {
    try {
        if (req.session.user) {
            return res.redirect('/products');
        }else {
            
        }
        next();
    } catch (error) {
        req.logger.error(`Controller views line 15 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
export const privateAccess = (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.status(403).redirect('/');
        }
        next();
    } catch (error) {
        req.logger.error(`Controller views line 63 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};