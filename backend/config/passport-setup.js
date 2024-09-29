const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./../models/v1/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      done(null, existingUser);
    } else {
      // If not, create a new user
      const newUser = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
      });
      await newUser.save();
      done(null, newUser);
    }
  } catch (err) {
    console.error(err);
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
