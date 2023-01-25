const express = require("express");
const auth = require("../middleware/auth");
const controllerObj = require("../controllers");
const router = new express.Router();

router.get("/details", auth, (req, res) => {
  const action = "user_details";
  controllerObj.controller(req, res, action);
});

router.get("/fetch_avatar", auth, (req, res) => {
  const action = "fetch_avatar";
  controllerObj.controller(req, res, action);
});

router.get("/all_user", (req, res) => {
  const action = "all_user";
  controllerObj.controller(req, res, action);
});

router.get("/details_update", auth, (req, res) => {
  const action = "details_update";
  controllerObj.controller(req, res, action);
});

router.get("/avatar_add", auth, (req, res) => {
  const action = "avatar_add";
  controllerObj.controller(req, res, action);
});

// --------------------------    NOT Requrement In Prod  (end)  -----------------------------

module.exports = router;
