const express = require("express");
const router = express.Router();
const users = require("../controllers/userController");

router.get("/", users.RetrieveALLusers);
// This route must appear BEFORE /:id, so Express does not
// mistake "employees-managers" for an ID.
router.get("/employees-managers", users.getEmployeesandmanagers);
router.get("/:id", users.getUserById);
router.put("/:id", users.updateUser);
router.delete("/:id", users.deleteUser);

// Register a new user using POST /auth/register.
module.exports = router;
