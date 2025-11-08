import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // Full name of the student
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },

    // Unique email for communication
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },

    // Reference to class (like 10A, 9B, etc.)
    class: {
      type: String,
      required: [true, "Class ID is required"],
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Class",
    },

    // classId: {
    //   type: String,
    // },

    // Academic year (string for flexibility)
    year: {
      type: String,
      required: [true, "Academic year is required"],
      enum: ["2020", "2021", "2022", "2023", "2024", "2025"],
      default: "2024",
    },

    // Optional attendance percentage or logs
    attendance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Optional performance metric (e.g. average marks)
    performance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
