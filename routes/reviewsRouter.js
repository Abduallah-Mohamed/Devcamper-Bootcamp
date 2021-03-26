const router = require("express").Router({ mergeParams: true });
const Review = require("../models/Review");
const {
    getReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");

const advancedResults = require("../middleware/advancedResults");

// authentication middleware
const { protect, authorize } = require("../middleware/auth");
router
    .route("/")
    .get(
        advancedResults(Review, {
            path: "bootcamp",
            select: "name description",
        }),
        getReviews
    )
    .post(protect, authorize("user", "admin"), createReview);

router
    .route("/:id")
    .get(getSingleReview)
    .put(protect, authorize("user", "admin"), updateReview)
    .delete(protect, authorize("user", "admin"), deleteReview);
module.exports = router;
