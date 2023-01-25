const defaultConfig = require("../../config/defaultConfig");
const CryptoJS = require("crypto-js");

exports.encryptObject = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), defaultConfig[defaultConfig.env].cryptoSecret).toString();
  } catch (e) {
    return '';
  }
};

exports.decryptObject = (data) => {
  try {
    var bytes = CryptoJS.AES.decrypt(data, defaultConfig[defaultConfig.env].cryptoSecret);
    if (bytes.toString(CryptoJS.enc.Utf8).length == 0) {
      return {};
    } else {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  } catch (e) {
    return {};
  }
};
