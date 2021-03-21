const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Add A Name"],
    },
    email: {
        type: String,
        required: [true, "please add the email"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please Add Valid Email Address !!"],
    },
    role: {
        type: String,
        enum: ["user", "publisher"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please Add A Password"],
        minLength: 6,
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Encrypt password before save using bcrypt
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign json web token and return
userSchema.methods.getSignWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN,
    });
};

// method that decrypt the password ... and compare it.
userSchema.methods.decryptPassowrd = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
