const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add the course title !"],
    },
    description: {
        type: String,
        required: [true, "Please add the description !"],
    },
    weeks: {
        type: String,
        required: [true, "Please add number of weeks !"],
    },
    tuition: {
        type: Number,
        required: [true, "Please Add the tuition cost !"],
    },
    minimumSkill: {
        type: String,
        required: [
            true,
            "Please add the minimum Skills Required before enrolling in this course !",
        ],
        enum: ["beginner", "intermediate", "advanced"],
    },
    scholarShipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});

// Static method to get average of course tuition
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        {
            $group: {
                _id: "$bootcamp",
                averageCost: { $avg: "$tuition" },
            },
        },
    ]);

    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost),
        });
    } catch (error) {
        console.error(error);
    }
};

// call getAverageCost after saving
CourseSchema.post("save", function () {
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost berfore removing
CourseSchema.pre("remove", function () {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
