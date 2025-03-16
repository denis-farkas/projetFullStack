const express = require("express");
const router = express.Router();

// Gérer les erreurs 404
router.use((req, res, next) => {
    const error = new Error("Page non trouvée");
    error.status = 404;
    next(error);
});

// Gérer les erreurs de serveur interne
router.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", { message: err.message, error: err });
});

module.exports = router;
