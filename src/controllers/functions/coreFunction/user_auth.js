const UserCred = require("../../../models/userCred");
const UserInfo = require("../../../models/userInfo");
var validator = require("validator");
const RegOtps = require("../../../models/regOtp");
const TokenModal = require("../../../models/token");
const defaultConfig = require("../../../config/defaultConfig");
const { encryptObject, decryptObject } = require("../encryption");
const {
  sendWelcomeEmail,
  sendOtpInMail,
  resetPasswordInMail,
} = require("../../../emails/account");
const bcrypt = require("bcryptjs");
const tokenFunction = require("../token");

const {
  DataModule,
  removeKeyForReturn,
  errorMsg,
  successMsg,
  toSmall,
  paginationData,
  DataModulePopulate,
} = require("../../../utils");
const { fetchCredFromId } = require("./common_function");
const { validate } = require("../../../models/regOtp");

const TokenGenaration = async (user, param, res) => {
  try {
    const aToken = await tokenFunction.accessToken(user._id);
    const userId = user._id;
    const refreshToken = await tokenFunction.generateRefreshToken(user._id);
    DataModule(TokenModal, "findOne", param)
      .then((usrdata) => {
        if (usrdata === null) {
          let token = new TokenModal();
          token.userId = userId;
          token.isLogin = true;
          token.tokens = [
            { access_token: aToken, refresh_token: refreshToken },
          ];
          token.save((tokenError, tokenData) => {
            if (tokenError) {
              return res.status(400).send(errorMsg(tokenError));
            }
            return res
              .status(201)
              .send(
                successMsg({ token: tokenData.tokens[0], user: user }, 201)
              );
          });
        } else {
          usrdata.isLogin = true;
          usrdata.tokens = [
            { access_token: aToken, refresh_token: refreshToken },
          ];

          usrdata.save((usrTokenError, usrTokenData) => {
            if (usrTokenError) {
              return res.status(400).send(errorMsg(usrTokenError));
            }
            return res
              .status(201)
              .send(
                successMsg({ token: usrTokenData.tokens[0], user: user }, 201)
              );
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

const fetchUserToken = (param, paramToken, res) => {
  try {
    DataModule(UserCred, "findOne", param)
      .then((usr) => {
        if (usr === null) {
          return res.status(400).send(errorMsg(511));
        }
        removeKeyForReturn(usr);
        TokenGenaration(usr, paramToken, res);
      })
      .catch((e) => {
        return res.status(500).send(errorMsg(e));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

const passwordChange = (data, password, res) => {
  try {
    DataModule(UserCred, "findOne", { email: data.email })
      .then((user) => {
        if (user !== null) {
          bcrypt.hash(
            password,
            defaultConfig[defaultConfig.env].saltRound,
            async function (e, hash) {
              if (e) {
                return res.status(400).send(errorMsg(e));
              }
              user.password = hash;
              user.save((passwordChangeError) => {
                if (passwordChangeError) {
                  return res.status(500).send(errorMsg(passwordChangeError));
                }
                // await sendWelcomeEmail(user.email , user.name);
                return res.status(201).send(successMsg(undefined, 204));
              });
            }
          );
        } else {
          return res.status(400).send(errorMsg(511));
        }
      })
      .catch((e) => {
        return res.status(500).send(errorMsg(e));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

const userTokenSave = (req, res) => {
  try {
    DataModule(UserCred, "findOne", {
      $or: [
        { userId: toSmall(req.body.userId) },
        { email: toSmall(req.body.email) },
      ],
    })
      .then((usr) => {
        if (usr !== null) {
          return res.status(310).send(errorMsg(510));
        }
        let user = new UserCred({
          email: toSmall(req.body.email),
          password: req.body.password,
        });
        bcrypt.hash(
          req.body.password,
          defaultConfig[defaultConfig.env].saltRound,
          async function (e, hash) {
            if (e) {
              return res.status(400).send(errorMsg(e));
            }
            user.password = hash;
            user.save((passwordEncError) => {
              if (passwordEncError) {
                return res.status(500).send(errorMsg(passwordEncError));
              }
              let infoData = new UserInfo({
                user: user._id,
                name: req.body.name,
              });
              infoData.save((infoError) => {
                if (infoError) {
                  return res.status(500).send(errorMsg(infoError));
                }
              });
            });
            const aToken = await tokenFunction.accessToken(user._id);
            const user_id = user._id;
            const refreshToken = await tokenFunction.generateRefreshToken(
              user._id
            );
            let token = new TokenModal();
            token.userId = user_id;
            token.isLogin = true;
            token.tokens = [
              { access_token: aToken, refresh_token: refreshToken },
            ];
            token.save((tokenGenError) => {
              if (tokenGenError) {
                return res.status(500).send(errorMsg(tokenGenError));
              }
              removeKeyForReturn(user);
              // await sendWelcomeEmail(user.email , user.name);
              return res
                .status(201)
                .send(successMsg({ token: token.tokens[0], user: user }, 201));
            });
          }
        );
      })
      .catch((e) => {
        return res.status(500).send(errorMsg(e));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

const dataCheck = (varEmail, req, res) => {
  try {
    DataModule(RegOtps, "findOne", { email: varEmail })
      .then((eml) => {
        if (eml !== null) {
          if (eml.attempt >= defaultConfig[defaultConfig.env].otpLimit) {
            return res.status(400).send(errorMsg(532));
          } else {
            eml.attempt = Number(eml.attempt) + 1;
            // sendOtpInMail(eml.email, eml.otp);
            eml.save((dataCheckError) => {
              if (dataCheckError) {
                return res.status(500).send(errorMsg(dataCheckError));
              }
              // sendOtpInMail(user_otp.email, user_otp.otp);
              return res.status(200).send(successMsg(undefined, 202));
            });
          }
        } else {
          // random otp genarate
          // var otp_var = Math.floor(100000 + Math.random() * 900000);
          var otp_var = 999999;
          let user_otp = {
            email: varEmail,
            otp: otp_var,
            attempt: 1,
          };
          console.log(user_otp);
          const otp_model = new RegOtps(user_otp);
          otp_model.save((dataCheckError) => {
            if (dataCheckError) {
              return res.status(500).send(errorMsg(dataCheckError));
            }
            // sendOtpInMail(user_otp.email, user_otp.otp);
            return res.status(200).send(successMsg(undefined, 202));
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

//..................................   Export Functions   .................................

exports.loginPasswordUser = async (req, res) => {
  try {
    const isUserEmail = validator.isEmail(toSmall(req.body.userId));
    DataModule(
      UserCred,
      "findOne",
      isUserEmail
        ? { email: toSmall(req.body.userId) }
        : { userId: toSmall(req.body.userId) }
    )
      .then(async (user) => {
        if (user === null) {
          return res.status(400).send(errorMsg(511));
        }
        if (!(await bcrypt.compare(req.body.password, user.password))) {
          return res.status(400).send(errorMsg(512));
        }
        await removeKeyForReturn(user);

        await TokenGenaration(user, { userId: user._id }, res);
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.loginOtpUser = function (req, res) {
  try {
    fetchCredFromId(req.body.userId)
      .then((data) => {
        DataModule(RegOtps, "findOne", { email: data.email })
          .then((eml) => {
            if (eml === null) {
              return res.status(404).send(errorMsg(508));
            }
            if (eml.otp !== req.body.otp) {
              if (eml.attempt >= defaultConfig[defaultConfig.env].otpLimit) {
                return res.status(400).send(errorMsg(532));
              }
              eml.attempt = Number(eml.attempt) + 1;
              eml.save((dataError) => {
                if (dataError) {
                  return res.status(500).send(errorMsg(dataError));
                }
              });
              return res.status(400).send(errorMsg(509));
            }
            if (eml.attempt >= defaultConfig[defaultConfig.env].otpLimit) {
              return res.status(400).send(errorMsg(532));
            }
            eml.attempt = Number(eml.attempt) + 1;
            eml.save((dataError) => {
              if (dataError) {
                return res.status(500).send(errorMsg(dataError));
              }
              fetchUserToken({ email: data.email }, { userId: data.id }, res);
            });
          })
          .catch((err) => {
            return res.status(500).send(errorMsg(err));
          });
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.emailCheck = function (req, res) {
  try {
    dataCheck(toSmall(req.body.email), req, res);
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.userIDCheck = function (req, res) {
  try {
    fetchCredFromId(req.body.userId)
      .then((data) => {
        dataCheck(data.email, req, res);
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.registerUser = function (req, res) {
  try {
    DataModule(RegOtps, "findOne", { email: toSmall(req.body.email) })
      .then((data) => {
        if (data === null) {
          return res.status(404).send(errorMsg(508));
        }
        if (data.otp !== req.body.otp) {
          return res.status(400).send(errorMsg(509));
        } else if (data.attempt >= defaultConfig[defaultConfig.env].otpLimit) {
          return res.status(400).send(errorMsg(532));
        }
        data.attempt = Number(data.attempt) + 1;
        data.save((dataError) => {
          if (dataError) {
            return res.status(500).send(errorMsg(dataError));
          }
          userTokenSave(req, res);
        });
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.userCheck = function (req, res) {
  try {
    DataModule(UserCred, "findOne", { userId: toSmall(req.body.userId) })
      .then((user) => {
        if (user !== null) {
          return res.status(404).send(errorMsg(518));
        }
        if (toSmall(req.body.userId).indexOf(" ") >= 0) {
          return res.status(404).send(errorMsg(531));
        }
        return res.status(200).send(successMsg(undefined, 203));
      })
      .catch((err) => {
        x;
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.changeUserid = function (req, res) {
  try {
    DataModule(UserCred, "findOne", { userId: toSmall(req.body.userId) })
      .then((user) => {
        if (user !== null) {
          return res.status(404).send(errorMsg(518));
        }
        DataModule(UserCred, "findOne", { _id: req.user._id })
          .then((userData) => {
            if (userData === null) {
              return res.status(404).send(errorMsg(520));
            }
            userData.userId = toSmall(req.body.userId);
            userData.save((error) => {
              if (error) {
                return res.status(500).send(errorMsg(error));
              }
              return res.status(200).send(successMsg(undefined, 204));
            });
          })
          .catch((err) => {
            return res.status(500).send(errorMsg(err));
          });
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.requestForChangePassword = (req, res) => {
  try {
    fetchCredFromId(req.body.userId)
      .then((data) => {
        let dataVar = {
          userId: data.userId,
          time: Date(),
        };
        let encryptData = encryptObject(dataVar);
        let url =
          defaultConfig[defaultConfig.env].resetPasswordUrl + encryptData;
        console.log(encryptData);
        // resetPasswordInMail(data.email, url)
        return res.status(201).send(successMsg(undefined, 207));
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

// exports.changePassword = (req, res) => {
//   let decryptData = decryptObject(req.params[0]);
//   if (decryptData?.userId && decryptData?.time) {
//     if (new Date() - new Date(decryptData.time) > defaultConfig[defaultConfig.env].resetPasswordValidity * 60 * 1000) {
//       return res.status(500).send(errorMsg(errorMsg(519)));
//     } else {
//       fetchCredFromId(decryptData.userId)
//         .then((data) => {
//           passwordChange(data, req.body.password, res);
//         })
//         .catch((err) => {
//           return res.status(500).send(errorMsg(err));
//         });
//     }
//   } else {
//     return res.status(401).send(errorMsg(errorMsg(501)));
//   }
// };

exports.changePassword = (req, res) => {
  try {
    fetchCredFromId(req.body.user)
      .then((data) => {
        DataModule(RegOtps, "findOne", { email: data.email })
          .then((eml) => {
            if (eml === null) {
              return res.status(404).send(errorMsg(508));
            }
            if (eml.otp !== req.body.otp) {
              if (eml.attempt >= defaultConfig[defaultConfig.env].otpLimit) {
                return res.status(400).send(errorMsg(532));
              }
              eml.attempt = Number(eml.attempt) + 1;
              eml.save((dataError) => {
                if (dataError) {
                  return res.status(500).send(errorMsg(dataError));
                }
              });
              return res.status(400).send(errorMsg(509));
            }
            if (eml.attempt >= defaultConfig[defaultConfig.env].otpLimit) {
              return res.status(400).send(errorMsg(532));
            }
            eml.attempt = Number(eml.attempt) + 1;
            eml.save((dataError) => {
              if (dataError) {
                return res.status(500).send(errorMsg(dataError));
              }
              passwordChange(data, req.body.password, res);
            });
          })
          .catch((err) => {
            return res.status(500).send(errorMsg(err));
          });
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.logoutUser = (req, res) => {
  try {
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};

exports.socialLogin = (req, res) => {
  try {
    let valParam = [{ userId: toSmall(req.body.userId) }];
    if (req.body.fbId) {
      valParam.push({
        fbId: "f-" + req.body.fbId,
        userId: "f-" + req.body.fbId,
      });
    }
    if (req.body.googleId) {
      valParam.push({
        googleId: "g-" + req.body.googleId,
        userId: "g-" + req.body.googleId,
      });
    }
    DataModule(UserCred, "findOne", { $or: valParam })
      .then((user) => {
        if (user === null) {
          let userData = new UserCred();
          if (req.body.fbId) {
            userData.userId = "f-" + req.body.fbId;
            userData.fbId = "f-" + req.body.fbId;
          }
          if (req.body.googleId) {
            userData.userId = "g-" + req.body.googleId;
            userData.googleId = "g-" + req.body.googleId;
          }
          if (req.body.email) {
            userData.email = req.body.email;
          }
          userData.save(async (er) => {
            if (er) {
              if (userData._id) {
                await TokenGenaration(userData, { userId: userData._id }, res);
              }
              return res.status(500).send(errorMsg(err));
            }
            let varData = {};
            varData.user = userData._id;
            if (req.body.name) {
              varData.name = req.body.name;
            }
            if (req.body.img) {
              varData.images = req.body.img;
            }
            let info = new UserInfo(varData);
            info.save((err) => {
              if (err) {
                return res.status(500).send(errorMsg(err));
              }
              userData.userInfo = info._id;
              userData.save((errr) => {
                if (err) {
                  return res.status(500).send(errorMsg(err));
                }
              });
            });
            await TokenGenaration(userData, { userId: userData._id }, res);
          });
        } else {
          TokenGenaration(user, { userId: user._id }, res);
        }
      })
      .catch((err) => {
        return res.status(500).send(errorMsg(err));
      });
  } catch (e) {
    return res.status(500).send(errorMsg(505));
  }
};
