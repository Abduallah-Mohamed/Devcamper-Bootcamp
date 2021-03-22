const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

// @desc    get all Bootcamps
// @route   Get api/v1/bootcamp
// @access  Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
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
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `Bootcamp with id ${req.params.id} is not exist`,
                404
            )
        );
    }
    bootcamp.remove();
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

// @desc    Upload Photo for Bootcamp
// @route   PUT api/v1/bootcamp/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `Bootcamp with id ${req.params.id} is not exist`,
                404
            )
        );
    }

    if (!req.files) {
        return next(new ErrorResponse("There No Files Uploaded ... !!", 400));
    }

    const file = req.files.file;

    // make sure that the image is a photo
    if (!file.mimetype.startsWith("image")) {
        return next(
            new ErrorResponse("Please upload an image file ....!!", 400)
        );
    }

    // Check for the file size upload
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than in size ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // put random name for each photo
    file.name = `photo_${bootcamp.id}${path.parse(file.name).ext}`;

    // use the mv function to save the photo
    file.mv(`${process.env.UPLOAD_FILE_PATH}/${file.name}`, async (error) => {
        if (error) {
            console.error(error);
            return next(
                new ErrorResponse(`Problem with the file uplaod !!`, 500)
            );
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});
