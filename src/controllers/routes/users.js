import { userModel } from "../../models/user.js";

export const userPremium = async (req, res) => {
    try {
        const email = req.user.email;
        const hasRequiredDocuments =
            req.user.documents &&
            req.user.documents.length >= 3 &&
            req.user.documents.some(
                doc =>
                    doc.name === "identification" ||
                    doc.name === "proof_of_Address" ||
                    doc.name === "proof_of_Account_Statement"
            );

        if (req.user.premium === false) {
            if (hasRequiredDocuments) {
                await userModel.updateOne({ email }, { $set: { premium: true } });
                return res.status(200).send({
                    status: "success",
                    message: "You meet the requirements, upgraded user to premium successfully"
                });
            }
        } else {
            if (req.user.premium === true) {
                await userModel.updateOne({ email }, { $set: { premium: false } });
                return res.status(200).send({
                    status: "success",
                    message: "Downgrade premium user to normal user successfully"
                });
            } else {
                return res.status(500).send({
                    status: "error",
                    message:
                        "To be premium, you must upload all the documents: Identification, Proof of Address & Proof of Account Statement in your profile section"
                });
            }
        }
    } catch (error) {
        req.logger.error(`Controller session line 63 ${error.message}, ${error.code}`);
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
        console.error(error);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
};


