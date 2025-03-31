const Role = require("../schemas/role");

// Lấy tất cả các roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Tạo role mới
exports.createRole = async (req, res) => {
    try {
        const { name } = req.body;
        const newRole = new Role({ name });
        await newRole.save();
        res.status(201).json({ success: true, data: newRole });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật role
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedRole = await Role.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json({ success: true, data: updatedRole });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa role
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        await Role.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Role deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
