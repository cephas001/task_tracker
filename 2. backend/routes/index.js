const router = require("express").Router();
const genPassword = require("../utils/passwordUtils").genPassword;
const validatePassword = require("../utils/passwordUtils").validatePassword;
const issueJwt = require("../utils/jwtUtils").issueJwt;
const emailService = require("../utils/emailUtils").emailService;
const validateOtp = require("../utils/otpUtils").validateOtp;
const User = require("../models/User");

require("dotenv").config({ path: "../config/config.env" });

// Route to add new user
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  let error = [];
  User.findOne({ email })
    .then(async (user) => {
      try {
        if (user && user.authenticated) {
          error.push({ message: "This email has already been registered" });
          res.json(error);
        } else if (user && !user.authenticated) {
          const { salt, hash } = genPassword(password);
          try {
            const response = await User.updateOne(
              { email },
              {
                $set: {
                  username,
                  salt,
                  hash,
                },
              }
            );
            await emailService(res, email);
          } catch (err) {
            res.status(500).json({ message: "Problem with server" });
          }
        } else {
          try {
            await emailService(res, email);
            const { salt, hash } = genPassword(password);
            const newUser = new User({
              username,
              authenticated: false,
              email,
              salt,
              hash,
            });
            const user = await newUser.save();
          } catch (err) {
            res.status(500).json({ message: "Problem with server" });
          }
        }
      } catch (err) {
        res.status(500).json({ message: "Problem with server" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Problem with server" });
    });
});

router.put("/register", async (req, res) => {
  const formerEmail = req.body.formerEmail;
  const newEmail = req.body.newEmail;
  if (formerEmail == null) {
    res.status(400).json({ message: "Please don't change email" });
    return;
  }
  try {
    const response = await User.updateOne(
      { email: formerEmail },
      {
        $set: {
          email: newEmail,
        },
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Problem with server" });
  }
  if (response.matchedCount < 1) {
    res.status(400).json({ message: "Please don't change email" });
    return;
  }
  res.json({ message: "Updated" });
});

router.post("/verify", async (req, res) => {
  await validateOtp(req, res);
});

router.post("/resend", async (req, res) => {
  const email = req.body.email;

  if (!(await User.findOne({ email }))) {
    res.status(400).json({ message: "Please don't change email" });
    return;
  }

  await emailService(res, email);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.json({ message: "Wrong credentials! Invalid email or password" });
      } else {
        if (user && user.authenticated) {
          const valid = validatePassword(password, user.salt, user.hash);
          if (!valid) {
            res.json({
              message: "Wrong credentials! Invalid email or password",
            });
          } else {
            const token = issueJwt(user);
            res.json({ token });
          }
        } else if (user && !user.authenticated) {
          res.json({
            message:
              "You are not authenticated! Please go back to the sign up page and fill in accordingly to recieve a code to authenticate your email.",
          });
        }
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Problem with server" });
    });
});

module.exports = router;
