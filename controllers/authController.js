const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
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

// @desc    Log User Out / Clear Cookie
// @route   Get api/v1/auth/logout
// @access  Private
exports.logOut = asyncHandler(async (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
});

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

// @desc    Update user details
// @route   Get api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    // fields to be update
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc    Update Password
// @route   Get api/v1/auth/udatepassword
// @access  private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    // Check for current password
    if (!(await user.decryptPassowrd(req.body.currentPassword))) {
        return next(new ErrorResponse("Password is incorrect", 401));
    }

    // if the password correct then pass the new password field to the user
    user.password = req.body.newPassword;

    // save the new password
    await user.save();

    sendTokenReponse(user, 200, res);
});

// @desc    Forgot password
// @route   Post api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse("There is no user with that email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    console.log(resetUrl);
    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset token",
            message,
        });
        res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse("Email could not be sent", 500));
    }
});

// @desc    Reset Password
// @route   PUT api/v1/auth/resetpassword/:resetToken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get Hasshed Token From the URL
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorResponse("Invalid Token From URL", 400));
    }

    // set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendTokenReponse(user, 200, res);
});

// helper function - get token from the model, create a cookie then send the response
const sendTokenReponse = (user, statusCode, res) => {
    // Create token (which came from the methods in User Model)
    const token = user.getSignWebToken();

    const options = {
        experis: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    // set the secure flag to be true if on production
    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie("token", token, options)
        .json({ success: true, token });
};
