const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");

// @desc    Register User
// @route   Get api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role,
    });
    sendTokenReponse(user, 200, res);
});

// @desc    Login User
// @route   POST api/v1/auth/register
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email && !password) {
        return next(
            new ErrorResponse("Please Provide email and password", 404)
        );
    }

    // get user using email
    const user = await User.findOne({ email }).select("+password");

    // Check for user
    if (!user) {
        return next(new ErrorResponse("Invalid Cardentials", 401));
    }

    // Check if the password matched
    const isMatch = await user.decryptPassowrd(password);

    // check for the password
    if (!isMatch) {
        return next(new ErrorResponse("Invalid Cardentials", 401));
    }

    sendTokenReponse(user, 200, res);
});

// helper function for the
const sendTokenReponse = (user, statusCode, res) => {
    // Create token (which came from the methods in User Model)
    const token = user.getSignWebToken();

    const options = {
        experis: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    // set the secure flag to be to true if on production
    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie("token", token, options)
        .json({ success: true, token });
};

// @desc    Get Current Logged User
// @route   Get api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user,
    });
});
