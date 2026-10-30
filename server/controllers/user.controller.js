
import User from "../models/user.model.js";

// CREATE - New users receive the regular user role
const create = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({
      name,
      email,
      password,
      role: "user"
    });

    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
const list = async (req, res) => {
  try {
    const users = await User.find()
      .select("-hashed_password -salt");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

// READ ONE
const read = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-hashed_password -salt");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid user ID" });
  }
};

// UPDATE - Only allow name and email changes
const update = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-hashed_password -salt");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE ONE
const remove = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE ALL
const removeAll = async (req, res) => {
  try {
    const result = await User.deleteMany({});

    res.status(200).json({
      message: "All users deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete users"
    });
  }
};

// FIND USER BY ID
const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user"
    });
  }
};

export default {
  create,
  list,
  read,
  update,
  remove,
  removeAll,
  userByID
};
