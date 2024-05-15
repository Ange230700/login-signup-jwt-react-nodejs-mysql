const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import user-related actions
const { checkUser } = require("../../../middlewares/authMiddleware");

const {
  browse,
  read,
  signup,
  login,
} = require("../../../controllers/userActions");

// Route to get a list of users
router.get("/", browse);

// Route to get a specific user by ID
router.get("/:id", read);

// Route to add a new item
router.post("/", checkUser);
router.post("/signup", signup);
router.post("/login", login);

/* ************************************************************************* */

module.exports = router;
