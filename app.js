const express = require("express");
const authRoutes = require("./routes/auth_routes");
const profileRoutes = require("./routes/profile_routes");
const passportSetup = require("./config/passport_setup");
const app = express();
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");

// set up view engine
app.set("view engine", "ejs");

// set up cookie
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

// initialize passport
app.use(passport.initialize());

app.use(passport.session());

// set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// connect to mongodb
mongoose
  .connect(keys.mongoDB.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Database connection successful");

    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => console.log(err));
