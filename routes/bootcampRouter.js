const router = require("express").Router();
const {
    // Get All the functions From the BootCamp-Controller
    getBootCamps,
    getSingleBootCamp,
    updateSingleBootCamp,
    createBootCamp,
    deleteBootCamp,
} = require("../controllers/bootcampController");

router.route("/").get(getBootCamps).post(createBootCamp);

router
    .route("/:id")
    .get(getSingleBootCamp)
    .put(updateSingleBootCamp)
    .delete(deleteBootCamp);

module.exports = router;
