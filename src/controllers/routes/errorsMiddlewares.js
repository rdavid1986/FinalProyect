import EErrors from "../../services/errors/enums.js";
/* import CustomError from "../../services/errors/CustomError.js"; */

export default (error, req, res, next) => {
    switch (error.code){
        case EErrors.INVALID_TYPES_ERROR:
            res.send({status: "error", error: error.name});
            break;
        default:
            res.send({status: "error", error:"unhandled error"});
    }
};