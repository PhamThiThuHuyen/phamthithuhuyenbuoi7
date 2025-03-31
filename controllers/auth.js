const jwt = require("jsonwebtoken");
const constants = require("../utils/constants");

// Login
exports.login = async (req, res) => {
    try {
        let { username, password } = req.body;

        // Giả lập xác thực (thay bằng database thực tế)
        if (username === "admin" && password === "123456") {
            let token = jwt.sign({ username }, constants.SECRET_KEY, { expiresIn: "1h" });
            return res.status(200).json({ success: true, token });
        }

        res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Đăng ký (chỉ là ví dụ, thực tế cần lưu vào database)
exports.register = async (req, res) => {
    try {
        let { username, password } = req.body;
        res.status(201).json({ success: true, message: `Tài khoản ${username} đã được tạo.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy thông tin người dùng
exports.getMe = async (req, res) => {
    res.status(200).json({ success: true, data: req.user });
};

// Đổi mật khẩu (ví dụ, chưa lưu vào database)
exports.changePassword = async (req, res) => {
    res.status(200).json({ success: true, message: "Mật khẩu đã được đổi thành công." });
};
