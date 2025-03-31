var express = require("express");
var router = express.Router();
var userController = require("../controllers/users");
let { check_authentication, check_authorization } = require("../utils/check_auth");
const constants = require("../utils/constants");

// 🛠 Định nghĩa các route API
router.get("/", check_authentication, check_authorization(["mod"]), async (req, res, next) => {
    try {
        let users = await userController.getAllUsers();
        res.status(200).send({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/:id", check_authentication, check_authorization(["mod"]), async (req, res, next) => {
    if (req.params.id === req.user.id) {
        return res.status(403).json({ message: "Không thể xem thông tin của chính mình" });
    }
    try {
        let user = await userController.getUserById(req.params.id);
        res.status(200).send({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
});

router.post("/", check_authentication, check_authorization(constants.ADMIN_PERMISSION), async (req, res, next) => {
    try {
        let { username, password, email, role } = req.body;
        let newUser = await userController.createUser(username, password, email, role);
        res.status(201).send({
            success: true,
            message: "Tạo người dùng thành công",
            data: newUser,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message,
        });
    }
});

router.put("/:id", check_authentication, check_authorization(["admin"]), async (req, res, next) => {
    try {
        let updatedUser = await userController.updateUser(req.params.id, req.body);
        res.status(200).send({
            success: true,
            message: "Cập nhật người dùng thành công",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", check_authentication, check_authorization(["admin"]), async (req, res, next) => {
    try {
        let deleteUser = await userController.deleteUser(req.params.id);
        res.status(200).send({
            success: true,
            message: "Xóa người dùng thành công",
            data: deleteUser,
        });
    } catch (error) {
        next(error);
    }
});

// ✅ Xuất router một lần duy nhất
module.exports = router;
