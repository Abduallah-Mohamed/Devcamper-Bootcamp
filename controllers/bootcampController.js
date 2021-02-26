const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

// @desc    get all Bootcamps
// @route   Get api/v1/bootcamp
// @access  Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
    let query;

    // Copying req.query
    const reqQuery = { ...req.query };

    // fields to exclude
    const removeFields = ["select", "sort"];

    // loop over removeFields to delete these fields from the reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Makr reqQuery to be a string so i can play with
    let queryStr = JSON.stringify(reqQuery);

    // add $ before lte | lt | gt | gte .
    queryStr = queryStr.replace(
        /\b(lte|lt|gt|gte|in)\b/,
        (match) => `$${match}`
    );

    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr));

    // Check for select in the req.query
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    // excute the query
    const bootcamps = await query;
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
    res.status(204).json({ success: true });
});

// @desc    Get Bootcamps within radius
// @route   get api/v1/bootcamp/radius/:zipcode/:distance
// @access  Public
exports.getBootcampsWithinRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from Geocoder
    const loc = await geocoder.geocode(zipcode);
    const lag = loc[0].longitude;
    const lat = loc[0].latitude;

    // calculate the radius using radians
    // divide the distance by radius of the Earth
    // the radius of the Earth = 3,963 miles = 6,378 KM
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[lag, lat], radius] },
        },
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});
