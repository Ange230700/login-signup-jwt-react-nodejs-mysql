const jwt = require("jsonwebtoken");

const tables = require("../../database/tables");

// Helper function to create JWT token
const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const createToken = (id) =>
  jwt.sign({ id }, "super secret key", { expiresIn: maxAge });

const handleErrors = (err) => {
  console.error(err.message, err.code);
  const errors = { email: "", password: "" };

  // Incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // Incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // Duplicate error code
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  // Validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "super secret key", async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
        next();
      } else {
        const user = await tables.user.read(decodedToken.id);

        if (user) {
          res.json({ status: true, user: user.email });
        } else {
          res.json({ status: false });
          next();
        }
      }
    });
  } else {
    res.json({ status: false });
    next();
  }
};

module.exports = {
  checkUser,
  createToken,
  handleErrors,
};
