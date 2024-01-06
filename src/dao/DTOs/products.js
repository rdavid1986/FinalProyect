
export default class ProductDTO {
    constructor(product, user) {
        this.title = product.title,
        this.description = product.description,
        this.code = product.code,
        this.stock = product.stock > 0 ? product.stock : 0,
        this.category = product.category,
        this.thumbnail = product.thumbnail,
        this.price = product.price > 0 ? product.price : 0,
        this.category = product.category,
        this.active = true;
        this.owner = user.premium === true ? user._id : "admin";
    }
    
}