var express = require('express');
var router = express.Router();
const Role = require('../schemas/role'); // Model Mongoose
const roleController = require('../controllers/roles');
let { check_authentication, check_authorization } = require("../utils/check_auth");

// 🔹 GET all roles (dùng controller)
router.get("/", roleController.getAllRoles);

// 🔹 CREATE a new role (chỉ admin mới được tạo)
router.post("/", check_authentication, check_authorization(["admin"]), roleController.createRole);

// 🔹 UPDATE a role
router.put("/:id", check_authentication, check_authorization(["admin"]), roleController.updateRole);

// 🔹 DELETE a role
router.delete("/:id", check_authentication, check_authorization(["admin"]), roleController.deleteRole);

// 🔹 Nếu chưa có controller, dùng cách này để lấy roles từ DB
router.get('/all', async function (req, res, next) {
  try {
    let roles = await Role.find({});
    res.status(200).send({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

// 🔹 Nếu chưa có controller, dùng cách này để tạo role mới
router.post('/add', async function (req, res, next) {
  try {
    let body = req.body;
    let newRole = new Role({
      name: body.name
    });
    await newRole.save();
    res.status(201).send({
      success: true,
      data: newRole
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

// ✅ Xuất router một lần duy nhất
module.exports = router;
