import { userModel } from "../../models/user.js";
import config from "../../config/config.js";
import { createHash } from '../../utils.js'

const adminName = config.adminName

export const login = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "invalid credentials" });
    }
    delete req.user.password;
    if (req.user.email === adminName) {
        req.session.user = {
            first_name: "Admin",
            email: req.user.email,
            role: "Admin",
        };
        return res.status(200).send({ status: "success", payload: req.session.user });
    } else {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            cart: req.user.cart,
            role: req.user.role,
        }
        res.status(200).send({ status: "success", payload: req.user })
    }
};
export const failLogin = (req, res) => {
    req.logger.error("error Failed login");
    res.status(400).send({ error: "Failed login" });
};
export const register = async (req, res) => {
    res.send({ status: "success", message: "User register" })
};
export const failRegister = async (req, res) => {
    req.logger.error("error Register Failed");
    res.send({ error: "Register Failed" })
};
export const logout = async (req, res) => {
    try {
        req.session.destroy(error => {
            if (!error) {
                req.logger.info("Logout success");
                res.redirect("/");
            } else {
                req.logger.error("Logout Error", error);
                res.status(500).send({ status: 'Logout ERROR', body: error });
            }
        });
    } catch (error) {
        req.logger.error(`Controller session line 63 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};


export const restarPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send({ status: "error", error: "Imcomplete data" })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            req.logger.error("error non-existent user");
            return res.status(404).send({ status: "error", error: "non-existent user" })
        }
        await userModel.updateOne({ email }, { $set: { password: createHash(password) } });
    
        return res.status(200).send({ status: "success", message: "updated password successfully" })
    } catch (error) {
        req.logger.error(`Controller session line 77 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
    
};
export const github = async (req, res) => {
    try {
        req.session.user = req.user;
        res.redirect('/products')
    } catch (error) {
        req.logger.error(`Controller session line 87 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
export const current = async (req, res) => {
    try {
        if (req.user.email === config.adminName) {
            req.session.user = {
                email: req.user.email,
                role: "admin",
            }
            res.send(req.session.user)
        } else if (req.session.user) {
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                full_name: req.user.full_name,
                age: req.user.age,
                email: req.user.email,
                cart: req.user.cart,
                role: req.user.role,
                premium: req.user.premium,
                _id: req.user._id,
            }
            res.send(req.session.user)
        } else {
            req.logger.warn("You are not logged in");
            res.send({ status: "error", message: "You are not logged in" })
        }
    } catch (error) {
        req.logger.error(`Controller session line 117 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
    
}