import Qualification from "../models/qualification.model.js";

// CREATE
const create = async (req, res) => {
  try {
    const qualification = new Qualification(req.body);
    await qualification.save();

    res.status(201).json(qualification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
const list = async (req, res) => {
  try {
    const qualifications = await Qualification.find();
    res.json(qualifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ONE
const read = async (req, res) => {
  try {
    const qualification = await Qualification.findById(req.params.id);

    if (!qualification) {
      return res.status(404).json({ error: "Qualification not found" });
    }

    res.json(qualification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// UPDATE
const update = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!qualification) {
      return res.status(404).json({
        error: "Qualification not found"
      });
    }

    return res.status(200).json(qualification);
  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
};


// DELETE ONE
const remove = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndDelete(req.params.id);

    if (!qualification) {
      return res.status(404).json({ error: "Qualification not found" });
    }

    res.json({ message: "Qualification deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE ALL
const removeAll = async (req, res) => {
  try {
    await Qualification.deleteMany({});
    res.json({ message: "All qualifications deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default {
  create,
  list,
  read,
  update,
  remove,
  removeAll
};