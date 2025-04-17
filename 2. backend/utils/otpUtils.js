const User = require("../models/User");
const genPassword = require("./passwordUtils").genPassword;
const crypto = require("crypto");
const issueJwt = require("./jwtUtils").issueJwt;

const validateOtp = async (req, res, setObject) => {
  const { hashReceived, email, otp, password } = req.body;

  if (hashReceived == null || email == null || otp == null) {
    res.status(400).json({ message: "Please enter fields" });
    return;
  }
  const hashReceivedParts = hashReceived.split(".");
  const realHash = hashReceivedParts[0];
  const expires = hashReceivedParts[1];

  try {
    const user = await User.findOne({email})
    if (!user) {
      res.status(400).json({ message: "Please don't change email" });
      return;
    }
    if (Date.now() > parseInt(expires)) {
      res.json({ message: "Otp has expired" });
      return;
    }
    const data = `${email}.${otp}.${expires}`;
    const generatedHash = crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(data)
      .digest("hex");
    if (generatedHash === realHash) {
      try {
        const { salt, hash } = genPassword(password)
        const response = await User.updateOne(
          { email: email },
          {
            $set: {
            	authenticated: true, 
            	salt: salt !== null ? salt : user.salt, 
            	hash: hash !== null ? hash : user.hash 
           	},
          }
        );        
        const token = issueJwt(user);
        res.json({ message: "Validated", token });
      } catch(err) {
        res.status(500).json({message: "Problem with server"})
      }
    } else {
      res.json({ message: "Please enter correct code" });
    }
  } catch(err) {
    res.status(500).json({message: "Problem with server"})
  } 
}

module.exports = {
	validateOtp
}