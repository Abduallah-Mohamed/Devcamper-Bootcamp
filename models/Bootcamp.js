const mongoose = require("mongoose");
const slugify = require("slugify");
const gecoder = require("../utils/geocoder");

const BootCampSchema = new mongoose.Schema(
    {
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
            },
            coordinates: {
                type: [Number],
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
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// slugify the name for the bootcamp
BootCampSchema.pre("save", async function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Geocoder & create location field
BootCampSchema.pre("save", async function (next) {
    const loc = await gecoder.geocode(this.address);
    this.location = {
        type: "Point",
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: `${loc[0].streetName}`,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    };
    // Don't save the adress
    this.address = undefined;
    next();
});

// Cascade courses when a bootcamp is deleted
BootCampSchema.pre("remove", async function (next) {
    console.log(`Courses is bieng deleted from bootcamp with id ${this._id}`);
    await this.model("Course").deleteMany({ bootcamp: this._id });
    next();
});

// Reverse populate with vurtuals
BootCampSchema.virtual("courses", {
    ref: "Course",
    localField: "_id",
    foreignField: "bootcamp",
    justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootCampSchema);
