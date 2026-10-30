
import mongoose from "mongoose";

const QualificationSchema = new mongoose.Schema({
  // Existing Assignment 2 fields
  title: String,
  firstname: String,
  lastname: String,
  email: String,
  completion: Date,
  description: String,

  // Additional fields for the Education page
  qualification: {
    type: String,
    trim: true
  },
  institution: {
    type: String,
    trim: true
  },
  dates: {
    type: String,
    trim: true
  },
  detail: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  }
});

export default mongoose.model("Qualification", QualificationSchema);
