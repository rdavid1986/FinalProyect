import { userModel } from "../../models/user.js";
import config from "../../config/config.js";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: config.transportUser,
        pass: "liyg weqi dpux duuu"
    }
});
export const userPremium = async (req, res) => {
    try {
        const id = req.params.uid;
        const user = await userModel.findOne({_id: id});
        const email = user.email
        const hasRequiredDocuments =
            user.documents &&
            user.documents.length >= 3 &&
            user.documents.some(
                doc =>
                    doc.name === "identification" ||
                    doc.name === "proof_of_Address" ||
                    doc.name === "proof_of_Account_Statement"
            );
        
        if (user.premium === false) {
            if (hasRequiredDocuments) {
                await userModel.updateOne({ email }, { $set: { premium: true } });
                return res.status(200).send({
                    status: "success",
                    message: "Meet the requirements. Upgraded user to premium user successfully"
                });
            }
        } else {
            if (user.premium === true) {
                await userModel.updateOne({ email }, { $set: { premium: false } });
                return res.status(200).send({
                    status: "success",
                    message: "Downgrade premium user to normal user successfully"
                });
            } else {
                return res.status(500).send({
                    status: "error",
                    message:
                        "To be premium, the user must upload all the documents: Identification, Proof of Address & Proof of Account Statement in your profile section"
                });
            }
        }
    } catch (error) {
        req.logger.error(`Controller session userPremium ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
};
export const uploadDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).send({ status: "error", error: "No documents uploaded" });
        }
        const documentReferences = files.map((file, index) => {
            let name;
            switch (index) {
                case 0:
                    name = "identification";
                    break;
                case 1:
                    name = "proof_of_Address";
                    break;
                case 2:
                    name = "proof_of_Account_Statement";
                    break;
                default:
                    name = `File_${index + 1}`;
            }
            return {
                name,
                reference: `/public/documents/${file.originalname}`
            };
        });
        const hasAllDocuments = documentReferences.length === 3;
        if (hasAllDocuments) {
            await userModel.findByIdAndUpdate(userId, {
                $push: { documents: { $each: documentReferences } },
                $set: { status: true }
            });
        }
        res.status(200).send({ status: "success", message: "Documents uploaded successfully" });
    } catch (error) {
        req.logger.error(`Controller session uploadDocuments ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
};
export const getUser = async (req, res) => {
    try {
        const { userEmail } = req.params;
        const user = await userModel.findOne({ email: userEmail });
        if(user) {
            const formattedUsers ={
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                _id: user._id
            };
            res.status(200).json(formattedUsers);
        }else {
            res.status(404).json({ error: 'Error, the user doesnt exist' });
        }
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error to get user' });
    }
};
export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).populate("cart");
        const formattedUsers = users.map(user => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
        }));

        console.log(formattedUsers);
        res.status(200).json(formattedUsers);
    } catch (error) {
        req.logger.error(`Controller session getUsers ${error.message}, ${error.code}`);
        res.status(500).json({ error: 'Error ato get users' });
    }
};
export const deleteUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).populate("cart");

        const currentDate = new Date();
        const dateToDeleteUser = new Date(currentDate - 2 * 24 * 60 * 60 * 1000); //Two days ago
        /* const dateToDeleteUser = new Date(currentDate - 1 * 60 * 1000); */ // One minute ago


        const usersToDelete = users.filter(user => new Date(user.last_connection) < dateToDeleteUser);

        for (const user of usersToDelete) {
            
            let result = await transport.sendMail({
                from: "eccommercer coder proyect<r.david1923@gmail.com>",
                to: user.email,
                subject: "Eccommercer your acount has be deleted",
                html: `
                    <h1>Your acount has be deleted</h1>
                    <p>Due to the long inactivity of your account, it has been deleted.</p>
                    <p>Thanks for using our app</p>
                    `
            });
           
            await userModel.deleteOne({ _id: user._id });
        }

        req.logger.error(`Controller session deleteUsers ${error.message}, ${error.code}`);
        
        res.status(200).json({ message: 'delete inactivity user success', payload: { users: usersToDelete.email } });
    } catch (error) {
        console.error('Error to delete user:', error);
        res.status(500).json({ error: 'Error to delete user with last connection time expired' });
    }
};
export const changeRole = async (req, res) => {
    try {
        const { userEmailRole } = req.body;
        console.log("this is an email", userEmailRole);
        const user = await userModel.findOne({ email: userEmailRole });
        if (user) {
            if (user.role === 'user') {
                await userModel.updateOne({ email: userEmailRole }, { $set: { role: "admin" } });
                res.status(200).send({status: "success",message: "user role change to admin success"})
            } else if (user.role === 'admin') {
                await userModel.updateOne({ email: userEmailRole }, { $set: { role: "user" } });
                res.status(200).send({status: "success",message: "user role change to user success"})
            }
        } else {
            res.render("adminview", { status: "error", message: "User not found" });
        }
    } catch (error) {
        req.logger.error(`Controller session changeRole ${error.message}, ${error.code}`);
        res.render("adminview", { status: "error", error: 'Error to get user' });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { deleteUserEmail } = req.body;
        console.log("this is user delete email " ,deleteUserEmail);
        await userModel.deleteOne({ email: deleteUserEmail });
        res.status(200).send({ status: "success", message: "Delete user successfully" });
    } catch (error) {
        req.logger.error(`Controller session deleteUser ${error.message}, ${error.code}`);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};


