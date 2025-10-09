import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },

    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },

    dateOfBirth: { type: Date, required: true },

    address: { type: String, required: true },
    pinCode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Please enter a valid 6-digit PIN code"],
    },

    schoolName: { type: String, required: true },
    profilePhoto: { type: String, default: "" },

    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
