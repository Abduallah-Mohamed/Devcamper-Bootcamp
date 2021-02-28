const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
require("colors");
// Load env Variables
dotenv.config({ path: "./config/config.env" });

// conect to the database
connectDB();

// Route files
const bootcampRoute = require("./routes/bootcampRouter");
const coursesRouter = require("./routes/coursesRouter");

const app = express();

// Body Parser
app.use(express.json());

// Dev Logging using morgan module as a middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
// Mount File
app.use("/api/v1/bootcamps", bootcampRoute);
app.use("/api/v1/bootcamps/:bootcampId/courses", coursesRouter);
app.use("/api/v1/courses", coursesRouter);
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
