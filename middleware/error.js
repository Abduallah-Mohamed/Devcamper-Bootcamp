const ErrorResponse = require("../utils/errorResponse");

const errorhandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log for the dev
    console.log(`The Error is =====> ${err}`);

    // Mongoose bad objectID
    if (err.name === "CastError") {
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Handle Mongoose duplicate Error
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400);
    }

    // console.log(`error.name === ${error.name}`);
    // Mongoos Validator Errors
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        console.log(message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
};

module.exports = errorhandler;
