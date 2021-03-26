const router = require("express").Router();
const {
    // Get All the functions From the BootCamp-Controller
    getBootCamps,
    getSingleBootCamp,
    updateSingleBootCamp,
    createBootCamp,
    deleteBootCamp,
    getBootcampsWithinRadius,
    bootcampPhotoUpload,
} = require("../controllers/bootcampController");

const Bootcamp = require("../models/Bootcamp");

// include other routers here
const courses = require("./coursesRouter");
const reviews = require("./reviewsRouter");

const advancedResults = require("../middleware/advancedResults");
// authentication middleware
const { protect, authorize } = require("../middleware/auth");

// the next end points will be forward to the resource router
router.use("/:bootcampId/courses", courses);
router.use("/:bootcampId/reviews", reviews);

router.route("/radius/:zipcode/:distance").get(getBootcampsWithinRadius);

router
    .route("/")
    .get(advancedResults(Bootcamp, "courses"), getBootCamps)
    .post(protect, authorize("admin", "publisher"), createBootCamp);

router
    .route("/:id")
    .get(getSingleBootCamp)
    .put(protect, authorize("admin", "publisher"), updateSingleBootCamp)
    .delete(protect, authorize("admin", "publisher"), deleteBootCamp);

router.route("/:id/photo").put(protect, bootcampPhotoUpload);
module.exports = router;
