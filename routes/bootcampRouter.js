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

// const { advancedResults } = require("../middleware/advancedResults");

const advancedResults = require("../middleware/advancedResults");

// include other routers here
const courses = require("./coursesRouter");

// the next end point will be forward to the course router
router.use("/:bootcampId/courses", courses);

router.route("/radius/:zipcode/:distance").get(getBootcampsWithinRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootCamps)
  .post(createBootCamp);

router
  .route("/:id")
  .get(getSingleBootCamp)
  .put(updateSingleBootCamp)
  .delete(deleteBootCamp);

router.route("/:id/photo").put(bootcampPhotoUpload);
module.exports = router;
