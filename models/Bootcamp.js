const mongoose = require("mongoose");

const BootCampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Fill The Name Field"],
        unique: true,
        trim: true,
        maxLength: [50, "Name cannot be more than 50 Characters !"],
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please Fill The Description Field"],
        maxLength: [500, "Description cannot be more than 50 Characters !"],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please Add A Valid URL With http Or https",
        ],
    },
    phone: {
        type: String,
        maxLength: [20, "the Phone number must be less than 20 number !!"],
    },
    email: {
        type: String,
        match: [/\S+@\S+\.\S+/, "Please Add Valid Email Address !!"],
    },
    address: {
        type: String,
        required: [true, "Please add an Address !!"],
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ["Point"], // 'location.type' must be 'Point'
            // required: true,
        },
        coordinates: {
            type: [Number],
            // required: true,
            index: "2dsphere",
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        type: [String], // array of Strings beacause it will have a lot of Strings
        required: true,
        enum: [
            "Web Development",
            "Mobile Development",
            "UI/UX",
            "Data Science",
            "Business",
            "Others",
        ],
    },
    averageRatings: {
        type: String,
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: "no-photo.jpg",
    },
    housing: {
        type: Boolean,
        default: false,
    },
    jobAssistance: {
        type: Boolean,
        default: false,
    },
    jobGurantee: {
        type: Boolean,
        default: false,
    },
    acceptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Bootcamp", BootCampSchema);
