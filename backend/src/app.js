const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        callback(null, true);
      } else {
        callback(null, "Not allowed by CORS");
      }
    },
    credentials: true,
  })
);
app.use(express.json());



app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/jobs", require("./routes/job.routes"));
app.use("/api/applications", require("./routes/Application.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/verification", require("./routes/verification.routes"));



// 🚨 Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err : undefined
  });
});

module.exports = app;
