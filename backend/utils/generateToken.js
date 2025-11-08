import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing!");
    throw new Error("JWT_SECRET environment variable not set");
  }

  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export default generateToken;
