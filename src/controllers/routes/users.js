import { userModel } from "../../models/user.js";

export const userPremium = async (req, res) => {

    const user = req.session.user;
    const email = user.email;
    req.logger.info("user premium status");
    try {
        if (user.premium === "false") {
            await userModel.updateOne({ email }, { $set: { premium: "true" } });
            return res.status(200).send({ status: "success", message: "upgrade user to premium" })
        } else if (user.premium === "true") {
            await userModel.updateOne({ email }, { $set: { premium: "false" } });
            return res.status(200).send({ status: "success", message: "Downgrade premium user" })
        }
    } catch (error) {
        req.logger.error(`Controller session line 63 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }

}

