const express = require("express");
const router = express.Router();
const users = require("../controllers/userController");

router.get("/", users.getAllUsers);
router.get("/:id", users.getUserById);
router.put("/:id", users.updateUser);
router.delete("/:id", users.deleteUser);

// To create a user, use POST /auth/register.
module.exports = router;
