const UserCred = require("../../../models/userCred");
const UserInfo = require("../../../models/userInfo");
const { DataModule, toSmall } = require("../../../utils");
var validator = require("validator");

exports.fetchCredFromId = (id) => {
  try {
    const isUserEmail = validator.isEmail(toSmall(id));
    const data = {
      ...(isUserEmail && { email: toSmall(id) }),
      ...(!isUserEmail && { userId: toSmall(id) }),
    };
    return new Promise((resolve, reject) => {
      DataModule(UserCred, "findOne", data)
        .then((eml) => {
          if (eml === null) {
            reject(511);
          } else {
            resolve({ email: eml.email, phone: eml.phone, userId: eml.userId, id: eml._id });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (e) {
    return reject(e);
  }
};

exports.fetchDetailsFromId = (id) => {
  try {
    return new Promise((resolve, reject) => {
      DataModule(UserInfo, "findOne", { user: id })
        .then((data) => {
          if (data === null) {
            reject(511);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (e) {
    return reject(e);
  }
};
