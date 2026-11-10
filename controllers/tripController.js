const { db } = require("../db");

exports.getAllTrips = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM trips ORDER BY id");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTripById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM trips WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Trip not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTrip = async (req, res) => {
    const { destination, country, cost } = req.body;
    if (!destination || !country || cost == null || !Number.isFinite(Number(cost)) || Number(cost) < 0) {
        return res.status(400).json({ message: "Valid destination, country and cost are required" });
    }
    try {
        const [result] = await db.query(
            "INSERT INTO trips (destination, country, cost) VALUES (?, ?, ?)",
            [destination, country, Number(cost)]
        );
        res.status(201).json({ id: result.insertId, destination, country, cost: Number(cost) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTrip = async (req, res) => {
    const { destination, country, cost } = req.body;
    if (!destination || !country || cost == null || !Number.isFinite(Number(cost)) || Number(cost) < 0) {
        return res.status(400).json({ message: "Valid destination, country and cost are required" });
    }
    try {
        const [result] = await db.query(
            "UPDATE trips SET destination = ?, country = ?, cost = ? WHERE id = ?",
            [destination, country, Number(cost), req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Trip not found" });
        res.json({ message: "Trip updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM trips WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Trip not found" });
        res.json({ message: "Trip deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
