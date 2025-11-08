import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  classId: { type: String },
  year: { type: String },
  password: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  role: {
    type: String,
    enum: ["Admin", "Teacher", "Student"],
    default: "Student",
  },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
