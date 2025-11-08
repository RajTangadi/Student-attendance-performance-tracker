import Student from "../models/Student.js";
import User from "../models/Users.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(req.body);

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  let student = null;
  if (role === "Student") {
    student = await Student.findOne({ email });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    studentId: student ? student._id : null,
  });
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: student ? student._id : null,
    },
    token: generateToken(user._id, user.role),
    message: "User registered successfully",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user?.studentId || null,
      },
      token: generateToken(user._id, user.role),
      message: "Login successful",
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
