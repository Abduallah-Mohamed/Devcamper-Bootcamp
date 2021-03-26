const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

require("colors");

// Lood Env Vars
dotenv.config({ path: "./config/config.env" });

// Load Models ...
const Bootcamps = require("./models/Bootcamp");
const Courses = require("./models/Course");
const User = require("./models/User");
const Reviews = require("./models/Review");

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

// Read Json files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

// Import the data
const importData = async () => {
    try {
        await Bootcamps.create(bootcamps);
        await Courses.create(courses);
        await User.create(users);
        await Reviews.create(reviews);
        console.log("DATA IMPORTED ... ".green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

const deleteData = async () => {
    try {
        await Bootcamps.deleteMany();
        await Courses.deleteMany();
        await User.deleteMany();
        await Reviews.deleteMany();
        console.log("DATA DELETED FROM THE DATA-BASE".red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

if (process.argv[2] === "-import") {
    importData();
} else if (process.argv[2] === "-delete") {
    deleteData();
}
