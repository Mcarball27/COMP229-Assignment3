
import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  // Existing Assignment 2 fields
  firstname: {
    type: String,
    trim: true,
    required: true
  },
  lastname: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },

  // Additional contact form fields
  phone: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  preferredContactMethod: {
    type: String,
    enum: ["email", "phone", "either"],
    default: "email"
  },

  // Date the contact was submitted
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Contact", ContactSchema);
