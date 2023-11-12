import { Router } from "express";
import passport from "passport";
import {
    login,
    failLogin,
    register,
    failRegister,
    logout,
    restarPassword,
    github,
    current
} from "../controllers/routes/session.js";

const router = Router();

router.post('/login', passport.authenticate('login', /* {failureRedirect: '/failLogin'} */), login );
router.get('/failLogin', failLogin );
router.post('/register', passport.authenticate('register', {failureRedirect: '/failRegister'}) , register);
router.get('/failRegister',failRegister);
router.get('/logout', logout);
router.post("/restartPassword", restarPassword)
router.get('/github', passport.authenticate('github', {scope: ['user:email']}) ,async (req, res) => {})
router.get('/githubCallback', passport.authenticate('github', {failureRedirect:'/loginFailed'}) , github);
router.get("/current", current);

export default router;