import { v4 as uuidv4 } from 'uuid';
import { userModel } from "../../models/user.js"
import nodemailer from "nodemailer";
import config from "../../config/config.js";
import jwt from "jsonwebtoken";

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: config.transportUser,
        pass: config.mailerPass
    }
});

export const mailToRestorePassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            const token = jwt.sign({ email }, config.privateKey, { expiresIn: "10m" });
            try {
                let result = await transport.sendMail({
                    from: "eccommercer coder proyect<r.david1923@gmail.com>",
                    to: email,
                    subject: "Eccommercer Recover Password",
                    html: `
                        <h1>Recover Password</h1>
                        <p>Click on the button below to recover your password</p>
                        <a href="http://localhost:8080/restorePassword/${token}">Recover Password</a>
                        <p>Thanks for using our app</p>
                        `
                });
    
                delete user.password;
    
                res.status(200).send({ status: "success", token });
               
                await userModel.updateOne({ email: email }, { $set: { recoverToken: token } });
    
            } catch (error) {
                res.status(500).send({ status: "error", message: error.message });
                return;
            }
        } else {
            res.status(400).send({ status: "error", error: "invalid email" });
        }
    } catch (error) {
        req.logger.error(`Controller mailToRestorePassword ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
}
