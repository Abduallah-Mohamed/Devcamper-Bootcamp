const router = require("express").Router();
const {
  // Get All the functions From the BootCamp-Controller
  getBootCamps,
  getSingleBootCamp,
  updateSingleBootCamp,
  createBootCamp,
  deleteBootCamp,
  getBootcampsWithinRadius,
} = require("../controllers/bootcampController");

// include other routers here
const courses = require("./coursesRouter");
// the next end point will be forward to the course router
router.use("/:bootcampId/courses", courses);

router.route("/radius/:zipcode/:distance").get(getBootcampsWithinRadius);

router.route("/").get(getBootCamps).post(createBootCamp);

router
  .route("/:id")
  .get(getSingleBootCamp)
  .put(updateSingleBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
