const AvatarInfo = require("../../../models/avatarInfo");
const UserCred = require("../../../models/userCred");
const UserInfo = require("../../../models/userInfo");
const {
  errorMsg,
  successMsg,
  DataModulePopulate,
  getRandomFileName,
} = require("../../../utils");

exports.userInfo = (req, res) => {
  try {
    DataModulePopulate(
      UserCred.findOne({ _id: req.user._id }).populate({
        path: "userInfo",
      })
    )
      .then((data) => {
        if (data === null) {
          return res.status(400).send(errorMsg(520));
        } else {
          if (data?.userInfo) {
            let varData = data.userInfo;
            varData._doc.type = data.type;
            varData._doc.userId = data.userId;
            return res.status(200).send(successMsg(varData, 201));
          } else {
            var varData = {};
            varData.user = data._id;
            varData.type = data.type;
            return res.status(200).send(successMsg(varData, 201));
          }
        }
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.detailsUpdate = (req, res) => {
  try {
    DataModulePopulate(
      UserInfo.findOne({ user: req.user._id }).populate({
        path: "user",
      })
    )
      .then((data) => {
        if (data === null) {
          return res.status(400).send(errorMsg(520));
        } else {
          var varData = [];
          for (const [key, value] of Object.entries(req.body)) {
            if (["name", "img"].includes(key)) {
              varData[key] = value;
            }
          }
          varData.save((error) => {
            if (error) {
              return res.status(500).send(errorMsg(error));
            }
            return res.status(200).send(successMsg(undefined, 204));
          });
        }
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.avatarAdd = (req, res) => {
  try {
    DataModulePopulate(AvatarInfo.findOne({ user: req.user._id }))
      .then((data) => {
        var varData = new AvatarInfo();
        varData.createdBy = req.user._id;
        for (const [key, value] of Object.entries(req.body)) {
          if (
            ["avatarPath", "previewPath", "isPublic", "name", "type"].includes(
              key
            )
          ) {
            varData[key] = value;
          }
        }
        varData.save((error) => {
          if (error) {
            return res.status(500).send(errorMsg(error));
          }
          return res.status(200).send(successMsg(undefined, 204));
        });
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.avatarEdit = (req, res) => {
  try {
    DataModulePopulate(AvatarInfo.findOne({ _id: req.body.id }))
      .then((data) => {
        if (data === null) {
          return res.status(400).send(errorMsg(520));
        } else {
          for (const [key, value] of Object.entries(req.body)) {
            if (
              [
                "avatarPath",
                "previewPath",
                "isPublic",
                "name",
                "type",
              ].includes(key)
            ) {
              data[key] = value;
            }
          }
          data.save((error) => {
            if (error) {
              return res.status(500).send(errorMsg(error));
            }
            return res.status(200).send(successMsg(undefined, 204));
          });
        }
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.fetchAvatar = (req, res) => {
  var varData = [{ createdBy: req.user._id }];
  if (req.query.id) {
    varData = [{ createdBy: req.query.id }];
  }
  if (req.query.type) {
    varData.push({ type: req.query.type });
  }

  try {
    DataModulePopulate(AvatarInfo.find({ $and: varData }))
      .then((data) => {
        if (data === null) {
          return res.status(400).send(errorMsg(520));
        } else {
          return res.status(200).send(successMsg(data, 201));
        }
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.allUser = (req, res) => {
  try {
    DataModulePopulate(UserInfo.find({}).populate("user"))
      .then((data) => {
        if (data === null) {
          return res.status(400).send(errorMsg(520));
        } else {
          return res.status(200).send(successMsg(data, 201));
        }
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};
