const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(
  path.resolve(__dirname, "../keys/public_key.pem"),
  "utf-8"
);

const privateKey = fs.readFileSync(
  path.resolve(__dirname, "../keys/private_key.pem"),
  "utf-8"
);

function issueJwt(user) {
  try {
    const token = jwt.sign({ sub: user._id, iat: Date.now() }, privateKey, {
      expiresIn: "90d",
      algorithm: "RS256",
    });
    const tokenToStore = "Bearer " + token;
    return tokenToStore;
  } catch(err){
    res.status(500).json({message: "Problem with server"})
  }
}

function verifyJwt(token) {
  try {
    const verification = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    return verification;
  } catch(err) {
    res.status(500).json({message: "Problem with server"}) 
  }
}

module.exports = {
  issueJwt,
  verifyJwt,
};
