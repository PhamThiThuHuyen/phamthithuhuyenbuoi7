const Product = require("../schemas/product"); // Model của Mongoose

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        let products = await Product.find({});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        let { name, price, description } = req.body;
        let newProduct = new Product({ name, price, description });
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        let { id } = req.params;
        let updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        let { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Sản phẩm đã bị xóa." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
