const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Import And Use Routers Here
/* ************************************************************************* */

const itemsRouter = require("./items/router");
const usersRouter = require("./users/router");

router.use("/items", itemsRouter);
router.use("/users", usersRouter);

/* ************************************************************************* */

module.exports = router;
