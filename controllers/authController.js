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

    // Create token (which came from the methods in User Model)
    const token = user.getSignWebToken();

    res.status(200).json({ success: true, token });
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

    // Create token (which came from the methods in User Model)
    const token = user.getSignWebToken();

    res.status(200).json({ success: true, token });
});
