const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/userModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  renderSignUpForm,
  SignUp,
  renderLoginForm,
  login,
  logout,
} = require("../controllers/userController.js");

router.get("/signup", renderSignUpForm);

router.post("/signup", wrapAsync(SignUp));

router.get("/login", renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(login),
);

router.get("/logout", logout);

module.exports = router;
