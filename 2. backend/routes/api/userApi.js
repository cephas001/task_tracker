const router = require("express").Router();
const isAuthenticated =
  require("../../auth/authentication_middleware").isAuthenticated;
const reqUserMiddleware =
  require("../../middlewares/req_user_middleware").identifyUser;
const User = require("../../models/User");
const genPassword = require("../../utils/passwordUtils").genPassword;
const validatePassword = require("../../utils/passwordUtils").validatePassword;
const validateOtp = require("../../utils/otpUtils").validateOtp;
const mongodb = require("mongodb");
const emailService = require("../../utils/emailUtils").emailService;

router.get("/user", isAuthenticated, reqUserMiddleware, (req, res) => {
  res.json(req.user);
});

router.put("/user", isAuthenticated, async (req, res) => {
  try {
    var messageBody; 
    const user = await User.findOne({ _id: new mongodb.ObjectId(req.jwt.sub)});
    if(req.body.password) {
      const valid = validatePassword(req.body.password, user.salt, user.hash)
      if(valid) {
        var { salt, hash } = genPassword(req.body.new_password);  
      } else {
        messageBody = "Wrong password!"
      }
    }
    const response = await User.updateOne({ _id: new mongodb.ObjectId(req.jwt.sub)}, {
      $set: {
        username: req.body.username ? req.body.username : user.username, 
        salt: salt ? salt : user.salt,
        hash: hash ? hash : user.hash
      }
    })
    if(response.modifiedCount == 1) {
      res.json({message: "User details changed", changed: true})  
    } else {
      res.json({message: "Cannot change details", messageBody, changed: false})
    }
  } catch(err){
    res.status(500).json({message: "Problem with server"})
  }
})

router.put("/password_change", async (req, res) => {
  try {
    if(req.body.email) {
      const user = await User.findOne({email: req.body.email})
      if(!user) {
        res.json({message: "No user with the email provided", sent: false})
        return;
      }
      await emailService(res, req.body.email)
    }
  } catch(err){
    res.status(500).json({message: "Problem with server"})
  }
})

router.post("/user/verify", async (req, res) => {
  await validateOtp(req, res);
});

module.exports = router;
