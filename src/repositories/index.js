import { User, Products } from '../dao/factory.js'
import UserRepository from './users.js'
import ProductRepository from './products.js'

export const userService = new UserRepository(new User())
export const productService = new ProductRepository(new Products())