const { db } = require("../db");

exports.getAllReviews = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT r.id, r.user_id, u.USERNAME AS user_name,
                    r.trip_id, t.destination, r.rating, r.comment
             FROM reviews r
             JOIN users u ON u.id = r.user_id
             JOIN trips t ON t.id = r.trip_id
             ORDER BY r.id`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM reviews WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Review not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createReview = async (req, res) => {
    const { user_id, trip_id, rating, comment } = req.body;
    if (!Number.isInteger(user_id) || user_id < 1 || !Number.isInteger(trip_id) || trip_id < 1 ||
        !Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Valid user_id, trip_id and rating (1-5) are required" });
    }
    try {
        const [result] = await db.query(
            "INSERT INTO reviews (user_id, trip_id, rating, comment) VALUES (?, ?, ?, ?)",
            [user_id, trip_id, rating, comment ?? null]
        );
        res.status(201).json({ id: result.insertId, user_id, trip_id, rating, comment: comment ?? null });
    } catch (error) {
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({ message: "User or trip does not exist" });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.updateReview = async (req, res) => {
    const { rating, comment } = req.body;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be an integer from 1 to 5" });
    }
    try {
        const [result] = await db.query(
            "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
            [rating, comment ?? null, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Review not found" });
        res.json({ message: "Review updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Review not found" });
        res.json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
