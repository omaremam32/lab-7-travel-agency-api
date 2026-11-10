const { db } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a user. New accounts always start with the 'user' role.
const register = async (req, res) => {
    const { username, email, password, manager_id } = req.body;
    const manager = manager_id === undefined ? null : manager_id;
    if (typeof username !== "string" || !username.trim() ||
        typeof email !== "string" || !email.includes("@") ||
        typeof password !== "string" || password.length < 8 ||
        (manager !== null && (!Number.isInteger(manager) || manager < 1))) {
        return res.status(400).json({
            message: "Valid username, email, password (min 8 characters) and manager_id are required"
        });
    }
    try {
        // The PASSWORD column stores a bcrypt HASH, never the plain password.
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            "INSERT INTO USERS (USERNAME, EMAIL, PASSWORD, MANAGER_ID) VALUES (?, ?, ?, ?)",
            [username.trim(), email.trim().toLowerCase(), hashedPassword, manager]
        );
        return res.status(201).json({
            id: result.insertId,
            username: username.trim(),
            email: email.trim().toLowerCase(),
            manager_id: manager
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already registered" });
        }
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({ message: "Manager ID does not exist" });
        }
        return res.status(500).json({ message: "Could not register user" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const [rows] = await db.query(
            "SELECT ID, USERNAME, EMAIL, PASSWORD, ROLE FROM USERS WHERE EMAIL = ?",
            [email.trim().toLowerCase()]
        );
        const user = rows[0];
        if (!user || !(await bcrypt.compare(password, user.PASSWORD))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (!process.env.JWT_SECRET ||
            process.env.JWT_SECRET === "replace_with_a_long_random_secret") {
            return res.status(500).json({ message: "Set JWT_SECRET in .env" });
        }
        const token = jwt.sign(
            { userId: user.ID, role: user.ROLE },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.ID, username: user.USERNAME, email: user.EMAIL, role: user.ROLE }
        });
    } catch (error) {
        return res.status(500).json({ message: "Could not log in" });
    }
};

module.exports = { register, login };
