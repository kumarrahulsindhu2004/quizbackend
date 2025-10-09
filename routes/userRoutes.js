import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryModule from "cloudinary";
import { User } from "../models/user.js";
import { generateToken } from "../jwt.js";

const route = express.Router();

// ✅ Configure Cloudinary
const cloudinary = cloudinaryModule.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "student_profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// ✅ Register route
route.post("/register", upload.single("profilePhoto"), async (req, res) => {
  try {
    const data = req.body;
    console.log("📩 Received registration request:", data);

    // Attach uploaded image URL
    if (req.file && req.file.path) {
      data.profilePhoto = req.file.path;
    }

    // Check duplicate
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Save user
    const newUser = new User(data);
    const savedUser = await newUser.save();

    // Token
    const token = generateToken({ id: savedUser._id });

    res.status(200).json({
      message: "Registration successful",
      user: savedUser,
      token,
    });
  } catch (error) {
    console.error("❌ Error in registration route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Login route
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken({ id: user._id });

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default route;
