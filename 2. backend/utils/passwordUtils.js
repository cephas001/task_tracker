const crypto = require("crypto");

module.exports = {
  genPassword(password) {
    try {
      var salt = crypto.randomBytes(32).toString("hex");
      var genHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");

      return {
        salt: salt,
        hash: genHash,
      };
    } catch(err) {
      throw err
    }
    
  },

  validatePassword(password, salt, hash) {
    try {
      var genHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");

      return hash === genHash;
    } catch(err) {
      throw err
    }
  },
};
