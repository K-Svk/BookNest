require("dotenv").config();

const express = require("express");
const cors = require("cors");

const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const connectDB = require("./config/db");

console.log(
  "MONGO_URI exists:",
  !!process.env.MONGO_URI
);

console.log(
  "JWT_SECRET exists:",
  !!process.env.JWT_SECRET
);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/library", libraryRoutes);

app.get("/", (req, res) => {
  res.send("BookNest Backend is running!");
});

const PORT = 5000;

connectDB();

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});