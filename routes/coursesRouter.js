const router = require("express").Router({ mergeParams: true });
const {
  getCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/coursesController");

router.route("/").get(getCourses).post(addCourse);
// router.route("/bootcamps/:bootcampId/courses").get(getCourses); // this use if you dont want to use merge
router
  .route("/:id")
  .get(getSingleCourse)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
