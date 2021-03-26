const jwt = require("jsonwebtoken"); // to verify token that comes form the client side !
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
// const { head } = require("../routes/coursesRouter");

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        // Set Token From Bearer token in the header
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        // Set Token From Cookie
        // ! For Token inside cookies
        console.log("in the second descision");
        token = req.cookies.token;
    }

    if (!token) {
        return next(
            new ErrorResponse("Not authorized to access this route", 401)
        );
    }

    try {
        // decode the token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);

        req.user = await User.findById(decode.id);

        next();
    } catch (error) {
        console.error(error);
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role (${req.user.role}) is unauthorized to commit this action`,
                    403
                )
            );
        }
        next();
    };
};
