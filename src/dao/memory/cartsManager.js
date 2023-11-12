import fs from 'fs';

export default class cartsManager {
    constructor(path) {
        this.cart = [];
        this.path = path;
        this.loadData();
    }
    saveData = ()  =>{
        const data = JSON.stringify(this.cart, null, 4); // We use JSON.stringify with "null, 2" to format and indent the file
        fs.writeFileSync(this.path, data); 
    }
    loadData = () => {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, "utf-8");
            this.cart = JSON.parse(data);
        }
    }
    async autoId() {
        if (this.cart.length === 0) {
            return 1;
        } else {
            return this.cart[this.cart.length - 1].id + 1;
        }
    }
    async getQuantity(cId, pid) {
        const cartById = this.cart.find((cart) => cart.id === +cId);
    
        if (cartById) {
            const cartProductId = cartById.products.find(product => product.id === +pid);
    
            if (!cartProductId) {
                if (cartById.products.length === 0) {
                    return 1;
                } else {
                    return cartById.products[cartById.products.length - 1].quantity + 1;
                }
            } else {
                return cartProductId.quantity + 1;
            }
        }
    
        console.log("Error in getQuantity function");
        return 1; // Valor predeterminado en caso de error
    }
    async add(){
        const result = {status: "failed", message:""}
        
        const cart = {
            id: await this.autoId(),
            products: []
        }

        this.cart.push(cart);
        this.saveData();
        result.status = "success";
        result.message = "cart added successfully";
        console.log("cart added successfully");
        return result;

    }
    async get() {
        return this.cart.products;
    }
    async getById(id) {
        const result = {status: "failed", message:""}
        const searchById = this.cart.find((cart) => cart.id === +id);
        if (searchById) {
            console.log(` ---------------- This is the cart search by id ${id} ${JSON.stringify(searchById)} ---------------- `);
            result.status = "succes";
            result.message = `This is the cart search by id ${id}`
            return result, searchById.products;
        } else {
            console.log(` ---------------- cart with id : ${id} not found ---------------- `);
            result.status = "failed";
            result.message = `cart with id : ${id} not found`
            return result;
        }
    }
    async addToCart(cId, pId) {
        const result = { status: "failed", message: "" };
        const cartIndex = this.cart.findIndex((cart) => cart.id === +cId);

        const product = {

            id: +pId,
            quantity: 1
        }

        if (cartIndex === -1) {
            const newCart = await this.addCart();
            newCart.products.push(product);
            this.saveData();
            result.status = "success";
            result.message = `Product added to new cart: ${cId}`;
            return result;
        } else {
            const existingProductIndex = this.cart[cartIndex].products.findIndex((existingProduct) => existingProduct.id === +pId);
    
            if (existingProductIndex !== -1) {
                this.cart[cartIndex].products[existingProductIndex].quantity += 1;
            } else {
                product.quantity = 1;
                this.cart[cartIndex].products.push(product);
            }
            this.saveData();
            result.status = "success";
            result.message = `Product added to cart: ${cartIndex} successfully`;
            return result;
        }
    }
    async delete (id){
        const result = {status: "failed", message:""}
        const index = this.cart.findIndex((cart) => cart.id === +id);
        if (index === -1) {
            console.log(` ---------------- cart with id : ${id} not found ---------------- `);
            result.status = "failed";
            result.message = `cart with id : ${id} not found`
            return result;
        }else {
            this.cart.splice(index, 1);
            console.log(` ---------------- cart deleted ---------------- `);
            result.status = "success";
            result.message = `cart deleted`
            this.saveData();
            return result;
        }
    };
    
}