import passport from "passport";
import local from "passport-local"
import { userModel } from "../models/user.js";
import { createHash, isValidPassword } from '../utils.js'
import gitHubStrategy from "passport-github2";
import config from "./config.js";
import CartManager from "../dao/mongo/cartsManager.js";
import SaveUserDTO from "../dao/DTOs/SaveUser.js";


const cartManager = new CartManager();
const LocalStrategy = local.Strategy;
const GitHubStrategy = gitHubStrategy.Strategy;
const adminName = config.adminName
const adminPasword = config.adminPassword

export const initializePassport = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            const exists = await userModel.findOne({ email });
            if (exists) {
                console.log('User already exist')
                return done(null, false);
            };
            const cart = await cartManager.add();
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: "user",
                cart: cart._id
            };
            console.log("New user register ");
            
            let userDTO = new SaveUserDTO(newUser);
            let result = await userModel.create(userDTO);
            return done(null, result)
        } catch (error) {
            return done('Error at creating user:' + error)
        }
    }));
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            if (username === adminName && password === adminPasword) {
                const user = {
                    email: username,
                    role: "admin"
                };
                return done(null, user);
            } else if (username === adminName && password !== adminPasword) {
                return done(null, false, {
                    message: "incorrect password",
                });
            } else {
                const user = await userModel.findOne({ email: username });
                if (!user) {
                    console.log("user doesnt exist")
                    return done(null, false, {
                        message: "user doesnt exist",
                    });
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false);
                }
                return done(null, user);
            }
        } catch (error) {
            return done(error)
        }
    }));

    passport.use("github", new GitHubStrategy({
        clientID: config.githubClientID,
        clientSecret: config.githubClientSecret,
        callBackURL: config.githubCallbackUrl
    }, async (accessToken, refresToken, profile, done) => {
        try {
            let user = await userModel.findOne({ userName: profile._json.login });
            if (!user) {
                const cart = await cartManager.add();
                let newUser = { first_name: profile._json.name, userName: profile._json.login, email: profile._json.email, role: "user", cart: cart };
                let result = await userModel.create(newUser);
                return done(null, result);
            }
            done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        if (user.email === "adminCoder@coder.com") {
            done(null, "admin");
        } else {
            done(null, user._id);
        }
    });
    passport.deserializeUser(async (id, done) => {
        if (id === "admin") {
            const adminUser = {
                email: "adminCoder@coder.com",
            };
            return done(null, adminUser);
        } else {
            try {
                let user = await userModel.findById(id);
                return done(null, user);
            } catch (error) {
                return done(`Error to get user at passport 111: ${error}`);
            }
        }
    });
}