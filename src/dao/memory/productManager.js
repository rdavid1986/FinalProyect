import fs from 'fs';

export default class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
        this.loadData();
    }
    saveData = () => {
        const data = JSON.stringify(this.products, null, 4);
        fs.writeFileSync(this.path, data);
    }
    loadData = () => {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, "utf-8");
            this.products = JSON.parse(data);
        }
    }
    async add(title, description, category, price, thumbnail, code, stock) {
        const result = { status: "failed", message: "" }
        if (!title || !description || !category || !price || !thumbnail || !code || !stock) {
            console.log(` ----------------- ERROR: ----------------- 
             ----------------- Please complete all fields, all fields are required -----------------`);
            result.message = " Please complete all fields, all fields are required";
            console.log(" Please complete all fields, all fields are required");
            return result;
        } else {
            const product = {
                title,
                description,
                category,
                price,
                thumbnail,
                code,
                stock,
                status: true,
                id: this.autoId(),
            };
            this.loadData();
            if (this.products.length > 0) {
                if (this.products.some((existingProduct) => existingProduct.code === code)) {
                    console.log(`----------------- ERROR: ----------------- 
                         -----------------  this product code : ${code} already exists in products ----------------- `);
                    result.message = `this product code : ${code} already exists in products`;
                    console.log(`this product code : ${code} already exists in products`)
                    return result;
                } else {
                    product.thumbnail = [];
                    this.products.push(product);
                    this.saveData(this.products);
                    result.status = "success";
                    result.message = "Product added successfully"
                    console.log("Product added successfully");
                    return result;
                }
            } else {
                this.products.push(product);
                this.saveData();
                result.status = "success";
                result.message = "Product added successfully"
                console.log("Product added successfully");
                return result;
            }
        }
    }
    autoId() {
        if (this.products.length === 0) {
            return 1;
        } else {
            return this.products[this.products.length - 1].id + 1;
        }
    }
    async get() {
        return this.products;
    }
    async getById(id) {
        const result = { status: "failed", message: "" }
        const searchById = this.products.find((product) => product.id === parseInt(id));
        if (searchById) {
            console.log(` ---------------- This is the products search by id ---------------- `);
            result.status = "succes";
            result.message = `This is the products search by id ${id}`
            console.log(`This is the products search by id ${JSON.stringify(searchById)}`)
            return result, searchById;
        } else {
            console.log(` ---------------- Product with id : ${id} not found ---------------- `);
            result.status = "failed";
            result.message = `Product with id : ${id} not found`
            console.log(`Product with id : ${id} not found`)
            return result;
        }
    }
    async update(id, updateProduct) {
        const result = { status: "failed", message: "" }
        const productIndex = this.products.findIndex((product) => product.id === parseInt(id));
        if (productIndex !== -1) {
            const updatedProduct = { ...this.products[productIndex], ...updateProduct };
            this.products[productIndex] = updatedProduct;
            result.status = "success";
            result.message = `product updated successfully`
            console.log(`product updated successfully`);
            this.saveData();
            return result;
        } else {
            console.log(`---------------- The product with id : ${id} does not exist ----------------`);
            result.status = "failed";
            result.message = `The product with id : ${id} does not exist`;
            console.log(`Error : The product with id : ${id} does not exist`);
            return result;
        }
    }
    async delete(id) {
        const result = { status: "failed", message: "" }
        const index = this.products.findIndex((product) => product.id === +id);
        if (id === "") {
            console.log(` ---------------- You must complete id field ---------------- `);
            result.status = "failed";
            result.message = `You must complete id field`;
            console.log(`You must complete id field`)
            return result;
        } else if (index === -1) {
            console.log(` ---------------- Product with id : ${id} not found ---------------- `);
            result.status = "failed";
            result.message = `Product with id : ${id} not found`;
            console.log(`Product with id : ${id} not found`)
            return result;
        } else {
            this.products.splice(index, 1);
            console.log(` ---------------- Product deleted ---------------- `);
            result.status = "success";
            result.message = `Product deleted`;
            console.log(`Product deleted`);
            this.saveData();
            return result;
        }
    };
}

