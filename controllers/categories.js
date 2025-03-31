const Category = require("../schemas/category"); // Model của Mongoose

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
    try {
        let categories = await Category.find({});
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
    try {
        let { name } = req.body;
        let newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
    try {
        let { id } = req.params;
        let updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        let { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Danh mục đã bị xóa." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
