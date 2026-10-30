
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  // Existing Assignment 2 fields
  title: String,
  firstname: String,
  lastname: String,
  email: String,
  completion: Date,
  description: String,

  // Additional portfolio display fields
  slug: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  imageKey: String,
  imageAlt: String,
  role: String,
  outcome: String,
  details: [String],
  techStack: [String],
  timeline: String,
  liveUrl: String,
  repoUrl: String
});

export default mongoose.model("Project", ProjectSchema);
