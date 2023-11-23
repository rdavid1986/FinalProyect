import {generateMocking} from "../../utils.js";


export const generateProducts = async (req, res) => {
    try {
        const products = await generateMocking()
        res.send({status:"success", payload: products})
    } catch (error) {
        req.logger.error(`Controller mokingProducts line 10 ${error.message}, ${error.code}`);
        res.status(500).send({ status: "error", error: `${error.name}: ${error.cause},${error.message},${error.code}` });
    }
}