import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB
connectDB();

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://quizchas2025.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ CORS blocked for:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // ✅ this is enough
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("✅ Server running with CORS configured correctly!");
});
app.use("/user", userRoutes);

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
