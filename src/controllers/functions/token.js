const jwt = require("jsonwebtoken");
const defaultConfig = require("../../config/defaultConfig");
const utils = require("../../utils");
const TokenModal = require("../../models/token");
const { cache } = require("sharp");

module.exports = {
  accessToken: async function (id) {
    try {
      return jwt.sign({ _id: id }, defaultConfig[defaultConfig.env].accessTokenSecret, {
        expiresIn: defaultConfig[defaultConfig.env].accessTokenTime,
      });
    } catch (e) {
      return '';
    }
  },

  generateRefreshToken: async function (id) {
    try {
      return jwt.sign(
        {
          _id: id,
        },
        defaultConfig[defaultConfig.env].refressTokenSecret,
        { expiresIn: defaultConfig[defaultConfig.env].refreshTokenTime }
      );
    } catch (e) {
      return '';
    }
  },

  refreshToken: async function (req, res) {
    if (!req.body?.refresh_token) {
      return res.status(400).send(utils.errorMsg(516));
    }
    try {
      const varToken = req.body.refresh_token.replace("Bearer ", "");
      const decoded = jwt.verify(varToken, defaultConfig[defaultConfig.env].refressTokenSecret);
      const token = await this.accessToken(decoded._id);
      if (token !== null) {
        TokenModal.findOne({ userId: decoded._id }, function (err, tkn) {
          if (err) {
            return res.status(500).send(utils.errorMsg(534))
          };
          if (tkn?.tokens) {
            tkn.tokens[0].access_token = token;
            tkn.save((saveError, saveData) => {
              if (saveError) {
                return res.status(500).send(utils.errorMsg(534));
              }
              return res.status(200).send(utils.successMsg({ access_token: saveData.tokens[0].access_token }, 201));
            });
          } else {
            return res.status(500).send(utils.errorMsg(534));
          }
        })
      } else {
        return res.status(400).send(utils.errorMsg(534));
      }
    } catch (e) {
      return res.status(400).send(utils.errorMsg(534))
    }
  },
};
