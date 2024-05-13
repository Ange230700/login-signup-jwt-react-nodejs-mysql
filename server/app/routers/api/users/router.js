const express = require("express");
const router = express.Router();

const {
  register,
  login,
  checkUser,
} = require("../../../controllers/authControllers");

router.post("/", checkUser);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
