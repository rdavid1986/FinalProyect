
export const adminAccess = (req, res, next) => {
    if (req.session.user.email === "adminCoder@coder.com") {
        next();
    }else{
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