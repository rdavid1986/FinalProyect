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
        const last_connection = {
            $set: { last_connection: new Date().toISOString() }
        };
        await userModel.updateOne({ email: req.user.email }, last_connection);
    
        req.logger.info("user login")
        res.status(200).send({ status: "success", payload: req.session.user })
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
        const last_connection = {
            $set: { last_connection: new Date().toISOString() }
        };
        await userModel.updateOne({ email: req.user.email }, last_connection);
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
        if (req.body.user) {
            req.body.user = {
                first_name: req.body.user.first_name,
                last_name: req.body.user.last_name,
                full_name: req.body.user.full_name,
                age: req.body.user.age,
                email: req.body.user.email,
                cart: req.body.user.cart,
                role: req.body.user.role,
                premium: req.body.user.premium,
                _id: req.body.user._id,
            }
            res.status(200).send({ status: "success", payload: req.body.user })
        } else if (req.user.email === config.adminName) {
            req.session.user = {
                email: req.user.email,
                role: "admin",
            }
            res.status(200).send({ status: "success", payload: req.session.user })
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
            res.status(200).send({ status: "success", payload: req.session.user })
        } else {
            req.logger.warn("You are not logged in");
            res.status(200).send({ status: "success", payload: null })
        }
    } catch (error) {
        req.logger.error(`Controller session line 117 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
}
export const deleteUser = async (req, res) => {
    try {
        const user = req.body.user;
        const mockUser = req.body.mockUser;
        await userModel.deleteOne({email: mockUser.email});
        res.status(200).send({ status: "success", message: "user delete" })

    } catch (error) {
        req.logger.error(`Session.js line 141 ${error.message}, ${error.code}`);
        res.send({ status: "failed", message: "You are not allowed to access this" });
    }
}
