const User = require("../models/User");
const mongodb = require("mongodb");

async function identifyUser(req, res, next) {
  try {
    const user = await User.findOne({ _id: new mongodb.ObjectId(req.jwt.sub) });
    req.user = user;
    next();
  } catch(err) {
    res.status(500).json({message: "Problem with server"})
  }
}

module.exports = {
  identifyUser,
};
