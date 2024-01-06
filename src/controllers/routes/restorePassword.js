import { userModel } from "../../models/user.js";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import { createHash, isValidPassword } from '../../utils.js';

const privateKey = config.privateKey;

export const restorePassword = async (req, res) => {
    try {
        const recoverToken = req.params.recovertoken;
        const { newPassword, passwordRepeat } = req.body;

        const user = await userModel.findOne({ recoverToken });
        const decodedToken = jwt.verify(recoverToken, privateKey);
        const expirationTime = decodedToken.exp;

        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime < expirationTime) {
            if (isValidPassword(user, newPassword)) {
                req.logger.error("The password must be different from the previous one");
                res.status(400).send({ status: "error", error: "The password must be different from the previous one" });
            } else if (newPassword !== passwordRepeat) {
                req.logger.error("New passwords don't match");
                res.status(401).send({ status: "error", error: "New passwords don't match" });
            } else {
                await userModel.updateOne({ recoverToken }, { $set: { password: createHash(passwordRepeat) } });
                req.logger.info("updated password successfully");
                res.status(200).send({ status: "success", message: "updated password successfully" });
            }
            
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(409).send({ error: "error", message: "TokenExpiredError: Token has expired" });
        } else {
            console.error("Error:", error);
            res.status(500).send({ status: "error", error: "Internal Server Error" });
        }
        req.logger.error(`Controller restorePassword ${error.message}, ${error.code}`);
    }
};
