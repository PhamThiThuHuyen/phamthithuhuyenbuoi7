var express = require("express");
var router = express.Router();
let categorySchema = require("../schemas/category");

let categoryController = require("../controllers/categories");
let { check_authentication, check_authorization } = require("../utils/check_auth");

// ✅ Sử dụng Controller cho các chức năng chính
router.get("/", categoryController.getAllCategories); // Không yêu cầu đăng nhập
router.post("/", check_authentication, check_authorization(["mod"]), categoryController.createCategory);
router.put("/:id", check_authentication, check_authorization(["mod"]), categoryController.updateCategory);
router.delete("/:id", check_authentication, check_authorization(["admin"]), categoryController.deleteCategory);

// ✅ Các route tự định nghĩa
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);

    if (!category || category.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "ID không tồn tại hoặc đã bị xóa",
      });
    }

    res.status(200).send({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/", async function (req, res, next) {
  try {
    let { name } = req.body;
    let newCategory = new categorySchema({ name });

    await newCategory.save();
    res.status(201).send({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);

    if (!category || category.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "ID không tồn tại hoặc đã bị xóa",
      });
    }

    let { name } = req.body;
    if (name) category.name = name;

    await category.save();
    res.status(200).send({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);

    if (!category || category.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "ID không tồn tại hoặc đã bị xóa",
      });
    }

    category.isDeleted = true;
    await category.save();
    res.status(200).send({
      success: true,
      message: "Danh mục đã bị xóa",
      data: category,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
