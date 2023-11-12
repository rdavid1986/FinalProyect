import userDTO from '../dao/DTOs/users.js';
export default class userRepository {
    constructor(dao){
        this.dao = dao;
    }

    getUsers = async ()=> {
        const result = await this.dao.get();
        return result;
    }

    createUser = async(user) => {
        let newUser = new userDTO(user);
        const result = await this.dao.create(newUser);
        return result;
    }
}