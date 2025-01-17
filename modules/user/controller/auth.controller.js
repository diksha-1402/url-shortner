import passport from "passport";
import i18n from "../../../config/i18n.js";
import userModel from "../../../models/user.model.js";
import constants from "../../../utils/constants.js";
import helper from "../../../utils/helper.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const configureGoogleStrategy = async () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: constants.CONST_GOOGLE_CLIENT_ID,
        clientSecret: constants.CONST_GOOGLE_CLIENT_SECRET,
        callbackURL: constants.CONST_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { id, emails, displayName, photos } = profile;
          const email = emails[0].value;
          // Find or create the user in MongoDB
          let user = await userModel.findOne({ googleId: id });
          if (!user) {
            console.log(
              "user",
              user,
              profile.given_name,
              profile.family_name,
              profile.picture
            );
            user = new userModel({
              googleId: id,
              email,
              firstName: profile.name.givenName || "",
              lastName: profile.name.familyName || "",
              image: photos[0].value || "",
            });
            await user.save();
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id); // Use async/await
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

const googleCallbackHandler = async (req, res) => {
  const token = await helper.jwtToken(req.user);
  return helper.returnTrueResponse(
    req,
    res,
    constants.CONST_RESP_CODE_OK,
    i18n.__("lang_login_success"),
    token
  );
};

let authUserController = {
  configureGoogleStrategy: configureGoogleStrategy,
  googleCallbackHandler: googleCallbackHandler,
};

export default authUserController;
