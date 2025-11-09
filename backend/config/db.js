import mongoose from "mongoose";
import User from "../models/Users.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🗄️ MongoDB Connected Successfully");
    try {
        await User.createCollection();
        // console.log("'users' collection created");
    } catch (error) {
        console.error("Error creating collection",error.message);
        
    }
  } catch (error) {
    console.error("❌ Database connection failed", error.message);
    process.exit(1);
  }
};

function sayHello() {
    console.log("Hello");
}

export default connectDB;
