const { db } = require("../db");

exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, name, email FROM users ORDER BY id");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, name, email FROM users WHERE id = ?",
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "Valid name and email are required" });
    }
    try {
        const [result] = await db.query(
            "UPDATE users SET name = ?, email = ? WHERE id = ?",
            [name.trim(), email.trim().toLowerCase(), req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User updated" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email already exists" });
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
