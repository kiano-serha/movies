const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const userRoutes = require("./routes/userRoutes");
const verifyUser = require("./services/verifyUser");
const path = require('path');
require("dotenv").config();

const app = express();

app.use(express.static("public"));

app.use(
  cors({
    origin: [process.env.FRONTEND_ADDRESS],
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/auth", authRoutes);
app.use("/movies", verifyUser, movieRoutes);
app.use("/users", verifyUser, userRoutes);
app.get("/protected", verifyUser, (req, res) => {
  const values = {
    user_id: req.user_id,
  };
  return res.json(values);
});

app.listen(5000, () => {
  console.log("Server listening...");
});
