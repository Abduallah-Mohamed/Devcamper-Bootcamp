const router = require("express").Router();

const {
    getUser,
    getUsers,
    createUser,
    deleteUser,
    updateUser,
} = require("../controllers/userController");

const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
