const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandelr = require("../middleware/async");

// @desc    Get all users
// @route   Get api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandelr(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   Get api/v1/users/getuser/:id
// @access  Private/Admin
exports.getUser = asyncHandelr(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse("the id of this user is not exist", 401));
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc    Create single user
// @route   Post api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandelr(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user,
    });
});

// @desc    Update single user
// @route   Put api/v1/users/updateuser/:id
// @access  Private/Admin
exports.updateUser = asyncHandelr(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return next(new ErrorResponse("the id of this user is not exist", 401));
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc    Delete single user
// @route   DELETE api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandelr(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        success: true,
        data: {},
    });
});
