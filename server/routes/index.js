const express = require("express");
const router = express.Router();

// Route principale
router.get("/", (req, res) => {
    res.render("index");
});

module.exports = router;
