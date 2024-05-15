// Import access to database tables

const bcrypt = require("bcrypt");
const tables = require("../../database/tables");
const {
  createToken,
  maxAge,
  handleErrors,
} = require("../middlewares/authMiddleware");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all items from the database
    const users = await tables.user.readAll();

    // Respond with the items in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific item from the database based on the provided ID
    const user = await tables.user.read(req.params.id);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
// This operation is not yet implemented

// The A of BREAD - Add (Create) operation
const signup = async (req, res, next) => {
  try {
    // Extract the user data from the request body
    const { email, password } = req.body;

    // Hash the password before storing it
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the user into the database
    const insertId = await tables.user.create({
      email,
      password: hashedPassword,
    });

    // Create a token and set it in a cookie
    const token = createToken(insertId);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    // Respond with HTTP 201 (Created) and the ID of the newly inserted user
    res.status(201).json({
      user: insertId,
      created: true,
    });
  } catch (err) {
    console.error(err);
    const errors = handleErrors(err);
    res.status(400).json({
      errors,
      created: false,
    });

    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await tables.user.findByEmail(email);
    if (!user) throw Error("incorrect email");

    // Compare the provided password with the stored hashed password
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) throw Error("incorrect password");

    // Create a token and set it in a cookie
    const token = createToken(user.id);
    res.cookie("jwt", token, {
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    // Respond with HTTP 200 (OK) and the user ID
    res.status(200).json({ user: user.id, status: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors, status: false });
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
// This operation is not yet implemented

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  // edit,
  signup,
  login,
  // destroy,
};
