exports.handleNotFound = (req, res, next) => {
    const error = new Error("Page non trouvée");
    error.status = 404;
    next(error);
};

exports.handleError = (err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", { message: err.message, error: err });
};
