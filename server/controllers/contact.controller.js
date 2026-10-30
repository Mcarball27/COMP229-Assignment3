
import Contact from "../models/contact.model.js";

// CREATE — Admin only
const create = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    return res.status(201).json(contact);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// PUBLIC CONTACT FORM SUBMISSION
const submitMessage = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      message,
      preferredContactMethod
    } = req.body;

    // Validate the required information.
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof phone !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        error: "Please complete all required fields."
      });
    }

    const firstname = firstName.trim();
    const lastname = lastName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'.\- ]{0,39}$/;
    const phonePattern = /^[0-9+()\-\s]{7,20}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !namePattern.test(firstname) ||
      !namePattern.test(lastname) ||
      !phonePattern.test(cleanPhone) ||
      !emailPattern.test(cleanEmail) ||
      cleanMessage.length < 10 ||
      cleanMessage.length > 500 ||
      !["email", "phone", "either"].includes(preferredContactMethod)
    ) {
      return res.status(400).json({
        error: "Please check your contact information and message."
      });
    }

    const contact = await Contact.create({
      firstname,
      lastname,
      phone: cleanPhone,
      email: cleanEmail,
      message: cleanMessage,
      preferredContactMethod
    });

    // Do not return the visitor's private contact information.
    return res.status(201).json({
      message: "Your message was sent successfully.",
      id: contact._id
    });
  } catch (err) {
    return res.status(400).json({
      error: "Unable to submit your message."
    });
  }
};

// READ ALL — Admin only
const list = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json(contacts);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// READ ONE — Admin only
const read = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    return res.json(contact);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// UPDATE — Admin only
const update = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    return res.json(contact);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// DELETE ONE — Admin only
const remove = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    return res.json({
      message: "Contact deleted successfully"
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// DELETE ALL — Admin only
const removeAll = async (req, res) => {
  try {
    await Contact.deleteMany({});

    return res.json({
      message: "All contacts deleted successfully"
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export default {
  create,
  submitMessage,
  list,
  read,
  update,
  remove,
  removeAll
};
