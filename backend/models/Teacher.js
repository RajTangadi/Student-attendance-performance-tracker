import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    // Full name of the teacher
    name: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true,
    },

    // Unique email (used for login or identification)
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

    // Subject they teach
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },

    // Optional: link to classes handled by this teacher
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],

    // Optional: for role-based authentication (if using same auth system)
    role: {
      type: String,
      enum: ["teacher", "admin"],
      default: "teacher",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
