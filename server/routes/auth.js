const User = require("../models/User");
const auth = require("../middleware/auth");
const router = require("express").Router();
const Utility = require("../helpers/Utility");
const Errors = require("../helpers/Errors");
const sendMail = require("../helpers/email");
const CatchAsyncError = require("../helpers/CatchAsyncError");
const bcrypt = require("bcryptjs");

// User sign-up
router.post("/register", async (req, res, next) => {
  try {
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
      return next(new Errors("Cette adresse exist déjà", 400));
    }

    const user = new User(req.body);
    const activation = Utility.generateActivationToken(user);
    let data = { user, activationCode: activation.activationCode };
    await sendMail({
      to: user.email,
      subject: "Activation du compte store.",
      template: "activation-mail.ejs",
      data,
    });
    // await Email.sendVerificationEmail(user, req.get("origin"));
    res.status(201).json({
      success: true,
      message: `Veuillez vérifier votre e-mail : ${user.email}, Pour activer votre compte`,
      activationToken: activation.token,
    });
  } catch (error) {
    next(new Errors(error.message, 400));
  }
});

// ACTIVATE ACCOUNT
router.post(
  "/activation",
  CatchAsyncError(async (req, res, next) => {
    const { activation_token, activation_code } = req.body;
    const token = Utility.verifyActivationToken(activation_token);

    if (token.activationCode !== activation_code) {
      return next(new Errors("Activation code invalide!", 400));
    }

    const isEmailExist = await User.findOne({ email: token.email });
    if (isEmailExist) {
      return next(new Errors("Cette adresse exist déjà", 400));
    }

    const { email } = token;

    let user = new User({ email });
    await user.save();

    const access_token = user.signAccessToken();

    res.status(200).json({
      success: true,
      user,
      token: access_token,
    });

    try {
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

//User password
router.post("/new_password", auth, async (req, res, next) => {
  try {
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (!isEmailExist) {
      return next(new Errors("Cet utilisateur n'existe pas", 400));
    }

    let hash_password = await bcrypt.hash(req.body.password, 8);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        email: req.body.email,
        password: hash_password,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
});

// Update user's profile
router.put(
  "/update_profile",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
      });

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new Errors(error.message, 400));
    }
  })
);

//User login
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const access_token = await user.signAccessToken();
    res.status(200).json({
      success: true,
      user,
      token: access_token,
    });
  } catch (error) {
    next(error);
  }
});

// User logout
router.post("/logout", auth, async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Déconnexion successful" });
  } catch (error) {
    next(error);
  }
});



// Get user's profile
router.get(
  "/me",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new Errors(error.message, 400));
    }
  })
);

// FORGOT PASSWORD
router.post(
  "/forgot-password",
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(new Errors("aucun utilisateur trouvé", 400));
      }

      user.resetToken = {
        token: Math.floor(1000 + Math.random() * 9000).toString(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      await user.save();

      await sendMail({
        to: user.email,
        subject: "Changer de mot de passe STORE.",
        template: "password-reset-mail.ejs",
        data: { user },
      });

      res.status(200).send({
        success: true,
        message:
          "Veuillez vérifier votre adresse électronique pour les instructions de réinitialisation du mot de passe",
      });
    } catch (error) {
      return next(new Errors(error.message, 400));
    }
  })
);

// VERIFY ACCOUNT
router.post(
  "/verify-code",
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findOne({
        "resetToken.token": req.body.activation_code,
        "resetToken.expires": { $gt: Date.now() },
      });

      if (!user) {
        return next(new Errors("aucun utilisateur trouvé", 400));
      }

      // update password and remove reset token
      // user.password = req.body.password;
      // user.resetToken = undefined;
      await user.save();
      res.status(200).send({
        success: true,
        token: user.resetToken.token
      });
    } catch (error) {
      return next(new Errors(error.message, 400));
    }
  })
);
// RESET PASSWORD
router.post(
  "/reset-password",
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findOne({
        "resetToken.token": req.body.token,
        "resetToken.expires": { $gt: Date.now() },
      });

      if (!user) {
        return next(new Errors("aucun utilisateur trouvé", 400));
      }

      // update password and remove reset token
      user.password = req.body.password;
      user.resetToken = undefined;
      await user.save();
      res.status(200).send({
        success: true,
        message:
          "Réinitialisation du mot de passe réussie, vous pouvez maintenant vous connecter",
      });
    } catch (error) {
      return next(new Errors(error.message, 400));
    }
  })
);

module.exports = router;
