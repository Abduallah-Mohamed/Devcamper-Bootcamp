const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a title for a review!"],
        maxlength: [100, "your review must be less than 100"],
    },
    text: {
        type: String,
        required: [true, "please add some text"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, "Please Left Review For This Bootcamp"],
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

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        {
            $group: {
                _id: "$bootcamp",
                averageRatings: { $avg: "$rating" },
            },
        },
    ]);

    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageRatings: obj[0].averageRatings,
        });
    } catch (error) {
        console.error(error);
    }
};

// call getAverageCost after saving
ReviewSchema.post("save", function () {
    this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost berfore removing
ReviewSchema.pre("remove", function () {
    this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
