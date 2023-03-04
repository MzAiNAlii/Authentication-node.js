import { Router } from "express";
import loginController from "../controllers/login";
import signupController from "../controllers/signup";
import refreshTokenCotroller from "../controllers/refreshToken";
import logoutController from "../controllers/logout";

const router = Router()

router.get("/",(req,res) => {
    res.send("This is home Page")
})

router.post("/signup",signupController)

router.post("/login",loginController)

router.post("/refresh",refreshTokenCotroller)

router.post("/logout",logoutController)

export default router       