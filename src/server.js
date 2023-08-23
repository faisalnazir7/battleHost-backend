const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("../src/routes/userRoute");
const tournamentRoute = require("../src/routes/tournamentRoute");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");


const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:5173","http://127.0.0.1:5173"],
    credentials: true,
  }))
// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/tournament", tournamentRoute);

// Routes
app.get("/", (req, res) => {
    res.send("Home Page");
  });

// Error Middleware
app.use(errorHandler);


// Connect to database and start server

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        app.listen(PORT, () => {
            console.log('Server Running on port ' + PORT)
        })
    })
    .catch((err) => console.log(err));