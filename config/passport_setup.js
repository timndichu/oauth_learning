const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const User = require("../models/user");

// serialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => console.log(err));
});

passport.use(
  new GoogleStrategy(
    {
      // options for the strategy
      clientID: keys.google.GOOGLE_CLIENT_ID,
      clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      User.findOne({ googleId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            // already have the user
            console.log("user is: ", currentUser);
            done(null, currentUser);
          } else {
            // if not, create user in our db
            new User({
              userName: profile.displayName,
              googleId: profile.id,
              picture: profile.photos[0].value ?? "",
            })
              .save()
              .then((newUser) => {
                console.log("new user created: ", newUser);
                done(null, newUser);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  )
);
