const ErrorResponse = require("../utils/errorResponse");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");

// @desc    get all Reviews
// @route   Get api/v1/courses
// @route   Get api/v1/bootcamp/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        // * Here if you want to find courses for specific id .
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    get Single Review
// @route   Get api/v1/reviews/:id
// @access  Public
exports.getSingleReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description",
    });

    if (!review) {
        return next(
            new ErrorResponse(
                `There is no reviews with id of ${req.params.id}`,
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        data: review,
    });
});

// @desc    Create Single Review
// @route   Post api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
    // need to add the id to data we submitting
    req.body.bootcamp = req.params.bootcampId;

    // add the user id to the body wich come from the protect middleware
    req.body.user = req.user.id;

    // check if the bootcamp does exist
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    // if not exist return ...
    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `There is no bootcamp with id (${req.params.bootcampId})`,
                404
            )
        );
    }

    // create new review
    const review = await Review.create(req.body);

    // return the successful reponse
    res.status(201).json({
        success: true,
        data: review,
    });
});

// @desc    Update Single Review
// @route   Post api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    // get the review id from the bootcamp
    let review = await Review.findById(req.params.id);

    // check if the review doesnot exist
    if (!review) {
        return next(
            new ErrorResponse(
                `There is no reviews with id (${req.params.id})`,
                404
            )
        );
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ErrorResponse(
                `the user id ${review.user.toString} is not verified to do so.`,
                401
            )
        );
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    // return the successful reponse
    res.status(201).json({
        success: true,
        data: review,
    });
});

// @desc    Delete Single Review
// @route   Delete api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    // get the review id from the bootcamp
    const review = await Review.findById(req.params.id);

    // check if the review doesnot exist
    if (!review) {
        return next(
            new ErrorResponse(
                `There is no reviews with id (${req.params.id})`,
                404
            )
        );
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ErrorResponse(
                `the user id ${review.user.toString} is not verified to do so.`,
                401
            )
        );
    }

    await review.remove();

    // return the successful reponse
    res.status(204).json({
        success: true,
        data: {},
    });
});
