const jwt = require("jsonwebtoken");
const UserCred = require("../models/userCred");
const TokenModal = require("../models/token");
const { errorMsg, DataModulePopulate } = require("../utils");
const defaultConfig = require("../config/defaultConfig");
if (process.env.NODE_ENV !== "prod") {
  require("dotenv").config();
}

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, defaultConfig[defaultConfig.env].accessTokenSecret);
    DataModulePopulate(TokenModal.findOne({ userId: decoded._id }).populate("userId"))
      .then((data) => {
        if (data === null) {
          return res.status(404).send(errorMsg(520));
        }
        if (data.isLogin) {
          req.token = token;
          req.user = data.userId;
          next();
        } else {
          return res.status(401).send(errorMsg(525));
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(401).send(errorMsg(501));
      });
  } catch (e) {
    return res.status(401).send(errorMsg(501));
  }
};

module.exports = auth;
