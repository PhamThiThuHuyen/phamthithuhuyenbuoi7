var express = require("express");
var router = express.Router();
let userControllers = require("../controllers/users");
let { check_authentication } = require("../utils/check_auth"); // Chỉ require 1 lần
let jwt = require("jsonwebtoken");
let constants = require("../utils/constants");

let authController = require("../controllers/auth");

// Route sử dụng Controller (Cách tốt hơn)
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", check_authentication, authController.getMe);
router.post("/changePassword", check_authentication, authController.changePassword);

// Route sử dụng trực tiếp (Nếu cần custom)
router.post("/signup", async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let result = await userControllers.createAnUser(username, password, email, "user");
        res.status(200).send({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

router.post("/login", async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let result = await userControllers.checkLogin(username, password);
        let token = jwt.sign(
            {
                id: result,
                expireIn: (new Date(Date.now() + 3600 * 1000)).getTime(),
            },
            constants.SECRET_KEY
        );
        res.status(200).send({
            success: true,
            token
        });
    } catch (error) {
        next(error);
    }
});

router.get("/me", check_authentication, async function (req, res, next) {
    try {
        res.send({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
});

router.post("/changepassword", check_authentication, async function (req, res, next) {
    try {
        let { oldpassword, newpassword } = req.body;
        let user = await userControllers.changePassword(req.user, oldpassword, newpassword);
        res.send({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
