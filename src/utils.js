import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";
import {faker} from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//hash password process
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//comparition hash password
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


export const generateMocking = async () => {
    let products = [];
    for(let i= 0; i< 100; i++){
        products.push(generateProduct());
    }
    console.log("util creaste products",products)
    return products;
}

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        Description: faker.commerce.productDescription(),
        Thumbnail: faker.image.imageUrl(),
        Code: faker.random.alphaNumeric(6),
        Stock: faker.datatype.number(100), 
        price: parseFloat(faker.commerce.price()),
        id: faker.datatype.uuid(),
    };
};




export default __dirname;
