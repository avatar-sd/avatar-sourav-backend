const express = require("express");
const corsOrigin = require("../middleware/cors");
const controllerObj = require("../controllers");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/user_varification", async (req, res) => {
  const action = "user_verification";
  controllerObj.controller(req, res, action);
});

router.post("/register_user", async (req, res) => {
  const action = "register_user";
  controllerObj.controller(req, res, action);
});

router.post("/login", async (req, res) => {
  const action = "login_user";
  controllerObj.controller(req, res, action);
});

router.post("/logout", auth, async (req, res) => {
  const action = "logout_user";
  controllerObj.controller(req, res, action);
});

router.post("/refresh_token", async (req, res) => {
  const action = "refresh_token";
  controllerObj.controller(req, res, action);
});

router.post("/check_username", async (req, res) => {
  const action = "verify_username";
  controllerObj.controller(req, res, action);
});

router.post("/user_id_check", async (req, res) => {
  const action = "user_id_check";
  controllerObj.controller(req, res, action);
});

router.post("/social_login", async (req, res) => {
  const action = "social_login";
  controllerObj.controller(req, res, action);
});

router.post("/request_for_change_password", async (req, res) => {
  const action = "request_for_change_password";
  controllerObj.controller(req, res, action);
});

router.post("/change_userid", auth, async (req, res) => {
  const action = "change_userid";
  controllerObj.controller(req, res, action);
});

// router.post("/change_password/*", async (req, res) => {
//   const action = "change_password";
//   controllerObj.controller(req, res, action);
// });

router.post("/change_password", async (req, res) => {
  const action = "change_password";
  controllerObj.controller(req, res, action);
});

router.get("/verify_user_list", auth, async (req, res) => {
  const action = "verify_user_list";
  controllerObj.controller(req, res, action);
});

module.exports = router;
