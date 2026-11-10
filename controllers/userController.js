const { db } = require("../db");

// GET /users - retrieve all users without exposing password hashes.
const RetrieveALLusers = async (req, res) => {
    try {
        const query = "SELECT ID, USERNAME, EMAIL, ROLE, MANAGER_ID FROM USERS";
        const [users] = await db.query(query);

        return res.status(200).json({
            status: "success",
            data: users
        });
    } catch (error) {
        console.error("Retrieve users failed:", error.code);
        return res.status(500).json({ status: "failed" });
    }
};

// GET /users/employees-managers - self JOIN from the lecture.
const getEmployeesandmanagers = async (req, res) => {
    try {
        const query = `
            SELECT e.ID, e.USERNAME AS employee,
                   e.MANAGER_ID, m.USERNAME AS manager
            FROM USERS AS e
            LEFT JOIN USERS AS m ON e.MANAGER_ID = m.ID
            ORDER BY e.ID
        `;
        const [users] = await db.query(query);

        return res.status(200).json({
            status: "success",
            data: users
        });
    } catch (error) {
        console.error("Self join failed:", error.code);
        return res.status(500).json({ status: "failed" });
    }
};

const getUserById = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE, MANAGER_ID FROM USERS WHERE ID = ?",
            [req.params.id]
        );
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(users[0]);
    } catch (error) {
        return res.status(500).json({ message: "Could not retrieve user" });
    }
};

const updateUser = async (req, res) => {
    const { username, email, manager_id } = req.body;
    const manager = manager_id === undefined ? null : manager_id;

    if (typeof username !== "string" || !username.trim() ||
        typeof email !== "string" || !email.includes("@") ||
        (manager !== null && (!Number.isInteger(manager) || manager < 1))) {
        return res.status(400).json({ message: "Valid username, email and manager_id are required" });
    }
    if (manager !== null && Number(req.params.id) === manager) {
        return res.status(400).json({ message: "A user cannot be their own manager" });
    }

    try {
        const [result] = await db.query(
            "UPDATE USERS SET USERNAME = ?, EMAIL = ?, MANAGER_ID = ? WHERE ID = ?",
            [username.trim(), email.trim().toLowerCase(), manager, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User updated" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
        }
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({ message: "Manager ID does not exist" });
        }
        return res.status(500).json({ message: "Could not update user" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM USERS WHERE ID = ?",
            [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Could not delete user" });
    }
};

module.exports = {
    RetrieveALLusers,
    getEmployeesandmanagers,
    getUserById,
    updateUser,
    deleteUser
};
