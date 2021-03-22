const router = require("express").Router({ mergeParams: true });
const {
    getCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse,
} = require("../controllers/coursesController");

const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

// authentication middleware
const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(
        advancedResults(Course, {
            path: "bootcamp",
            select: "name description",
        }),
        getCourses
    )
    .post(protect, authorize("admin", "publisher"), addCourse);
// router.route("/bootcamps/:bootcampId/courses").get(getCourses); // this use if you dont want to use merge
router
    .route("/:id")
    .get(getSingleCourse)
    .put(protect, authorize("admin", "publisher"), updateCourse)
    .delete(protect, authorize("admin", "publisher"), deleteCourse);

module.exports = router;
