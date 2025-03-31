var express = require("express");
var router = express.Router();
let productSchema = require("../schemas/product");
let categorySchema = require("../schemas/category");
let productController = require("../controllers/products");
let { check_authentication, check_authorization } = require("../utils/check_auth");

// Routes chính
router.get("/", productController.getAllProducts); // Không yêu cầu đăng nhập
router.post("/", check_authentication, check_authorization(["mod"]), productController.createProduct);
router.put("/:id", check_authentication, check_authorization(["mod"]), productController.updateProduct);
router.delete("/:id", check_authentication, check_authorization(["admin"]), productController.deleteProduct);

// Hàm xây dựng truy vấn
function BuildQuery(query) {
  let result = {};

  if (query.name) {
    result.name = new RegExp(query.name, "i");
  }

  result.price = {};
  if (query.price) {
    if (query.price.gte) {
      result.price.$gte = Number(query.price.gte);
    } else {
      result.price.$gte = 0;
    }
    if (query.price.lte) {
      result.price.$lte = Number(query.price.lte);
    } else {
      result.price.$lte = 10000;
    }
  } else {
    result.price.$gte = 0;
    result.price.$lte = 10000;
  }

  return result;
}

// Lấy danh sách sản phẩm có filter
router.get("/list", async function (req, res, next) {
  try {
    let products = await productSchema.find(BuildQuery(req.query)).populate({
      path: "category",
      select: "name",
    });
    res.status(200).send({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Lấy sản phẩm theo ID
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let product = await productSchema.findById(id);
    if (product) {
      res.status(200).send({
        success: true,
        data: product,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ID không tồn tại",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Tạo sản phẩm
router.post("/", async function (req, res, next) {
  try {
    let body = req.body;
    let category = await categorySchema.findOne({ name: body.category });

    if (category) {
      let newProduct = new productSchema({
        name: body.name,
        price: body.price || 0,
        quantity: body.quantity || 0,
        category: category._id,
      });

      await newProduct.save();
      res.status(201).send({
        success: true,
        data: newProduct,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Danh mục không hợp lệ",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Cập nhật sản phẩm
router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let product = await productSchema.findById(id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "ID không tồn tại",
      });
    }

    let body = req.body;
    if (body.name) product.name = body.name;
    if (body.price) product.price = body.price;
    if (body.quantity) product.quantity = body.quantity;
    if (body.category) {
      let category = await categorySchema.findOne({ name: body.category });
      if (!category) {
        return res.status(400).send({
          success: false,
          message: "Danh mục không hợp lệ",
        });
      }
      product.category = category._id;
    }

    await product.save();
    res.status(200).send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Xóa sản phẩm
router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let product = await productSchema.findById(id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "ID không tồn tại",
      });
    }

    product.isDeleted = true;
    await product.save();
    res.status(200).send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
