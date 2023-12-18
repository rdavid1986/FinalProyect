export default class SaveUserDTO {
    constructor(user) {
        this.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
        this.last_name = user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1);
        this.email = user.email;
        this.age = user.age;
        this.full_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1) + ' ' + user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1);
        this.userName = user.userName ? user.userName : '';
        this.password = user.password;
        this.role = user.role;
        this.cart = user.cart;
        this._id = user._id;
        this.premium = user.premium;
        this.documents = user.documents;
        this.active = true;
    }
}
