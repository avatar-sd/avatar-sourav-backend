const utils = require("../../utils");
const defaultConfig = require("../../config/defaultConfig");
const appConfig = require("../../config/appConfig");

const {
  userInfo,
  allUser,
  fetchAvatar,
  detailsUpdate,
  avatarAdd,
} = require("./coreFunction/dashboard");
const { IsPresent, errorMsg } = require("../../utils");

exports.userDetails = function (req, res) {
  userInfo(req, res);
};

exports.fetchAvatar = function (req, res) {
  fetchAvatar(req, res);
};

exports.allUser = function (req, res) {
  allUser(req, res);
};

exports.detailsUpdate = function (req, res) {
  detailsUpdate(req, res);
};

exports.avatarAdd = function (req, res) {
  avatarAdd(req, res);
};
