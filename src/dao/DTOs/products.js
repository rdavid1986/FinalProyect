export default class ProductDTO {
    constructor(product) {
        this.title = product.title,
        this.description = product.description,
        this.code = product.code,
        this.stock = product.stock > 0 ? product.stock : 0,
        this.category = product.category,
        this.price = product.price > 0 ? product.price : 0,
        this.category = product.category,
        this.active = true;
    }
}