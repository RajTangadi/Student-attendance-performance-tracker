import mongoose from "mongoose";

const PerformanceSchema = new mongoose.Schema(
  {
    classId: { type: String, required: true },
    semester: { type: String, required: true },
    studentId: { type: String, required: true },
    maths: { type: Number, default: 0 },
    science: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    geography: { type: Number, default: 0 },
    english: { type: Number, default: 0 },
    it: { type: Number, default: 0 },
    total: { type: Number },
    grade: { type: String },
  },
  { timestamps: true }
);

// Automatically calculate total & grade before save
PerformanceSchema.pre("save", function (next) {
  const total =
    this.maths +
    this.science +
    this.social +
    this.geography +
    this.english +
    this.it;

  const avg = total / 6;
  this.total = total;

  if (avg >= 90) this.grade = "A+";
  else if (avg >= 80) this.grade = "A";
  else if (avg >= 70) this.grade = "B";
  else if (avg >= 60) this.grade = "C";
  else if (avg >= 50) this.grade = "D";
  else this.grade = "F";

  next();
});

PerformanceSchema.index({ classId: 1, semester: 1 }, { unique: false });

const Performance = mongoose.model("Performance", PerformanceSchema);
export default Performance;
