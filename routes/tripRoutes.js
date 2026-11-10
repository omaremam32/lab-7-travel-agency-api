
const express = require("express");
const router = express.Router();

const trips = require("../controllers/tripController");

router.get("/", trips.getAllTrips);
router.get("/:id", trips.getTripById);
router.post("/", trips.createTrip);
router.put("/:id", trips.updateTrip);
router.delete("/:id", trips.deleteTrip);

module.exports = router;
