const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const fileUpload = require("express-fileupload");
var cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("colors");
// Load env Variables
dotenv.config({ path: "./config/config.env" });

// conect to the database
connectDB();

// Route files
const bootcampRoute = require("./routes/bootcampRouter");
const coursesRouter = require("./routes/coursesRouter");
const auth = require("./routes/authRouter");
const users = require("./routes/userRouter");

const app = express();

// Body Parser
app.use(express.json());

// Cookie-parser
app.use(cookieParser());

// serve the static folder
app.use(express.static(path.join(__dirname, "public")));

// Dev Logging using morgan module as a middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// File Upload
app.use(fileUpload());

// Mount File
app.use("/api/v1/bootcamps", bootcampRoute);
app.use("/api/v1/bootcamps/:bootcampId/courses", coursesRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode , on port ${PORT}`.cyan
    )
);

// handle unhandled promises rejection
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);

    // Close the server and exit the process
    server.close(() => process.exit(1));
});
