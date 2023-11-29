const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const passport=require('passport')
const jwt = require('jsonwebtoken');
const  GoogleUser=require("./models/GoogleUser") 

passport.use(new GoogleStrategy({
    clientID: "825782166847-432urdg0ges1e60o7mbu7cbld4io202q.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/auth/google/callback",
    scope:["profile","email"]
  },
  async function(accessToken, refreshToken, profile, done) {
    const user=await GoogleUser.findById(profile.id)
    if(user){
        const googleUsername = profile.displayName;
        const token = jwt.sign({ username: googleUsername }, 'xaxayu');
        return done(null, { token, googleUsername });
    }else{
        const newUser=await GoogleUser.create({
            username:profile.displayName,
            email:profile.emails[0].value,
            profilePic:profile.photos[0].value,
            _id:profile.id,
        });
        const googleUsername = profile.displayName;
        const token = jwt.sign({ username: newUser.username }, 'xaxayu');
        return done(null, { token, googleUsername });
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, { id: user.id, token: user.token });
  });

  passport.deserializeUser((id, done) => {
    // Fetch the user from the database based on the id
    GoogleUser.findById(id, (err, user) => {
      done(err, user);
    });
  });