const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");

// @desc    get all Bootcamps
// @route   Get api/v1/bootcamp
// @access  Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});

// @desc    get single Bootcamp
// @route   Get api/v1/bootcamp/:id
// @access  Public
exports.getSingleBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `Bootcamp with id ${req.params.id} is not exist`,
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

// @desc    Create Single Bootcamp
// @route   Post api/v1/bootcamp/
// @access  Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp,
    });
});

// @desc    Update single Bootcamp
// @route   Put api/v1/bootcamp/:id
// @access  Private
exports.updateSingleBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `Bootcamp with id ${req.params.id} is not exist`,
                404
            )
        );
    }
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete single Bootcamp
// @route   Delete api/v1/bootcamp/:id
// @access  Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `Bootcamp with id ${req.params.id} is not exist`,
                404
            )
        );
    }
    res.status(200).json({ success: true, data: bootcamp });
});
