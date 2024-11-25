class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // Handling Mongoose CastError
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Handling Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
        err = new ErrorHandler(message, 400);
    }

    // Handling JWT error
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid JSON Web Token, please try again.";
        err = new ErrorHandler(message, 400);
    }

    // Handling JWT expired error
    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token has expired, please try again.";
        err = new ErrorHandler(message, 400);
    }

    // Send only the error message in the response body
    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};


export { ErrorHandler };
