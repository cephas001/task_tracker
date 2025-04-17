const verifyJwt = require("../utils/jwtUtils").verifyJwt;

function isAuthenticated(req, res, next) {
  const headerParts = req.headers.authorization.split(" ");
  if (
    headerParts[0] === "Bearer" &&
    headerParts[1].match(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    ) !== null
  ) {
    try {
      const verification = verifyJwt(headerParts[1]);
      req.jwt = verification;
      next();
    } catch (err) {
      res
        .status(401)
        .json({ message: "You are not authorized to visit this route" });
    }
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to visit this route" });
  }
}

module.exports = {
  isAuthenticated,
};
