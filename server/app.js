const express = require("express");
const { connectDB } = require("./config"); // Import de la fonction connectDB depuis config.js
const studentRoutes = require("./routes/students");
const groupRoutes = require("./routes/groups");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

// Connexion à la base de données via config.js
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:8888", // Allow only webpack dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/students", studentRoutes);
app.use("/api/groups", groupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
