const express = require("express");
const router = express.Router();
const { emailServiceContact } = require("../../utils/emailUtils");
const isAuthenticated =
  require("../../auth/authentication_middleware").isAuthenticated;
const reqUserMiddleware =
  require("../../middlewares/req_user_middleware").identifyUser;

router.post("/contact", isAuthenticated, reqUserMiddleware, (req, res) => {
	req.body.email = req.user.email;
	emailServiceContact(res, req.body)
})

router.post("/contact/not_logged_in", (req, res) => {
	emailServiceContact(res, req.body)
})

module.exports = router;