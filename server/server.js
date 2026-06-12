const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);

app.get("/", (req, res) => {
    res.send("CodeSage API Running...");
});


const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");

connectDB();


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


