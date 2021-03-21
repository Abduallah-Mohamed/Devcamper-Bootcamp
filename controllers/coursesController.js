const ErrorResponse = require("../utils/errorResponse");
const Courses = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");

// @desc    get all Courses
// @route   Get api/v1/courses
// @route   Get api/v1/bootcamp/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    // * Here if you want to find courses for specific id .
    const courses = await Courses.find({ bootcamp: req.params.bootcampId });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    get single course
// @route   Get api/v1/course/:id
// @access  Public
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  //   if not course
  if (!course) {
    return next(ErrorResponse(`there is no courses with id ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    create new course for specific bootcamp
// @route   POST api/v1/bootcamp/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  // get the bootcamp id from the params then put it to the bootcamp in the body
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  //   if not course
  if (!bootcamp) {
    return next(
      ErrorResponse(`there is no bootcamp with id ${req.params.bootcampId}`)
    );
  }

  // if there is bootcamp then create the course
  const course = await Courses.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Update existing course
// @route   PUT api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Courses.findById(req.params.id);

  //   if not course
  if (!course) {
    return next(ErrorResponse(`there is no course with id ${req.params.id}`));
  }

  // if there is bootcamp then create the course
  //   const course = await Courses.create(req.body);
  course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Delete existing course
// @route   DELETE api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id);

  //   if not course
  if (!course) {
    return next(ErrorResponse(`there is no course with id ${req.params.id}`));
  }

  // if there is bootcamp then create the course
  //   const course = await Courses.create(req.body);

  await course.remove();
  res.status(204).json({
    success: true,
    data: course,
  });
});
