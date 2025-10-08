import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS Configuration (must be before routes)
const allowedOrigins = [
  "http://localhost:5173",
  "https://quizchas2025.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ CORS blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Use CORS middleware
app.use(cors(corsOptions));

// ✅ Handle preflight requests globally
app.options("*", cors(corsOptions));

app.use(express.json());

// ✅ Basic test route
app.get("/", (req, res) => {
  res.send("✅ Server is live and CORS configured correctly!");
});

// ✅ API routes
app.use("/user", userRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
