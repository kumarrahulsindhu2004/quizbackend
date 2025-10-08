import express from "express";
import { User } from "../models/user.js";
import { generateToken,jwtAuthMiddleware } from "../jwt.js";
const route = express.Router();

route.post("/register", async (req, res) => {
  try {
    console.log("Received registration request:", req.body); // DEBUG
    const data = req.body;

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      console.log("Email already exists:", data.email);
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser = new User(data);
    const response = await newUser.save();

    console.log("User saved successfully:", response); // DEBUG

    const payload = { id: response._id };
    const token = generateToken(payload);
    console.log("Generated token:", token); // DEBUG

    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.error("Error in registration route:", error); // DEBUG
    res.status(500).json({ error: "Internal Server Error" });
  }
});


route.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email:email})

        // if user does not exist or passwprd does not match return error
        if(!user || !await user.comparePassword(password)){
            return res.status(401).json({error:"Invalid username or password"})
        }
        
        // generate Token
        const payload={
            id:user.id,
        }
        const token = generateToken(payload)

         res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        
      },
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'})
    }
})

export default route;
