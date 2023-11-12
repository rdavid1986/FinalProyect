import {generateMocking} from "../../utils.js";


export const generateProducts = async (req, res) => {
    const products = await generateMocking()
    console.log("mocking",products)
    res.send({status:"success", payload: products})
}