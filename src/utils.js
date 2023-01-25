const { errorCode, successCode } = require("./config/codeConfig");
var validator = require("validator");
const utils = require("./utils");
const config = require("./config/defaultConfig");
const CryptoJS = require("crypto-js");
const AWS = require('aws-sdk');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const ObjectId = require('mongoose').Types.ObjectId;

exports.errorMsg = function (code) {
  try {
    if (errorCode[code] !== undefined) {
      return {
        error_code: "E-" + code,
        message: errorCode[code],
      };
    } else {
      return {
        message: code?.toString(),
      };
    }
  } catch (e) {
    return {
      message: e?.toString(),
    };
  }
}
exports.successMsg = function (data, code) {
  try {
    if (successCode[code] !== undefined) {
      if (data !== undefined) {
        return {
          data: apiEncryptionData(data),
          success_code: "S-" + code,
          message: successCode[code],
        };
      } else {
        return {
          success_code: "S-" + code,
          message: successCode[code],
        };
      }
    } else {
      if (data !== undefined) {
        return {
          data: apiEncryptionData(data),
          message: code?.toString(),
        };
      } else {
        return {
          message: code?.toString(),
        };
      }
    }
  } catch (e) {
    return {
      message: e?.toString(),
    };
  }
},
  exports.removeKeyForReturn = async (obj, keys) => {
    try {
      if (keys === undefined) keys = ["password"];
      for (var key in keys) {
        obj[keys[key]] = undefined;
      }
      return await obj;
    } catch (e) {
      return obj
    }
  },
  exports.DataModule = (module, method, param) => {
    try {
      return new Promise((resolve, reject) => {
        module[method](param, function (err, data) {
          if (err) {
            reject(err);
          }
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    } catch (e) {
      return reject(e);
    }
  },
  exports.DataModulePopulate = (module) => {
    try {
      return new Promise((resolve, reject) => {
        module.exec(function (er, data) {
          if (er) {
            reject(er);
          }
          resolve(data);
        });
      });
    } catch (e) {
      return reject(e);
    }
  },
  exports.IsPresent = (array1, array2) => {
    try {
      let val = [];

      for (const prop in array1) {
        if (!(typeof array1[prop] === "string" && array1[prop].length === 0)) val.push(prop);
      }

      const result = array2.filter((x) => !val.includes(x));
      if (array1.email && !validator.isEmail(array1.email)) {
        return utils.errorMsg(506);
      } else if (result.length === 1) {
        return utils.errorMsg(result + " is required");
      } else if (result.length > 1) {
        return utils.errorMsg(result + " are required");
      } else {
        return result.length;
      }
    } catch (e) {
      return utils.errorMsg(505);
    }
  },

  exports.ApiValidationArr = (arr) => {
    try {
      let varIndex = null;
      for (let [index, val] of arr.entries()) {
        if (val) {
          varIndex = index;
          break;
        }
      }
      return varIndex;
    } catch (e) {
      return null;
    }
  };

exports.toSmall = (data) => {
  try {
    return String(data).toLowerCase();
  } catch (e) {
    return '';
  }
};

const isValidObjectId = (id) => {
  try {
    if (ObjectId.isValid(id)) {
      if ((String)(new ObjectId(id)) === id)
        return true;
      return false;
    }
    return false;
  } catch (e) {
    return false;
  }
}

exports.paginationData = async (data, pageCount) => {
  try {
    let page = 0;
    let paginationData = [];
    if (pageCount) {
      page = Number(pageCount);
    }
    paginationData = await data.slice((config.pageDataCount * page), (config.pageDataCount * (page + 1)));
    return paginationData;
  } catch (e) {
    return [];
  }
}

exports.paginationChatData = (data, pageCount) => {
  try {
    let arrSize = data.length;
    if (pageCount !== null) {
      arrSize = pageCount;
    }
    let paginationData = [];
    const startPage = (arrSize - config.pageChatCount) > 0 ? (arrSize - config.pageChatCount) : 0;
    const endPage = arrSize > 0 ? arrSize : 0;
    paginationData = data.slice(startPage, endPage);
    return { data: paginationData, lastPage: startPage };
  } catch (e) {
    return [];
  }
}

exports.sortArrayForChat = (arr) => {
  try {
    const arrData = [...arr];
    if (arrData instanceof Array && arrData.length > 0 && arrData[0] !== arrData[1]) {
      let varArr = []
      arrData?.map((x) => varArr.push(isValidObjectId(x)));
      if (varArr.includes(false)) {
        return null
      }
      const sortArr = arrData.sort();
      return sortArr[0] + sortArr[1];
    } else {
      return null
    }
  } catch (e) {
    return null;
  }
}

exports.apiDecryptionData = (data) => {
  try {
    if (data.encritption && data.data) {
      const bytes = CryptoJS.AES.decrypt(data.data.toString(), config[config.env].apiEncryptionSecret);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } else {
      return data
    }
  } catch (e) {
    return data;
  }
}
const apiEncryptionData = (data) => {
  try {
    const cipherDoc = CryptoJS.AES.encrypt(JSON.stringify(data), config[config.env].apiEncryptionSecret).toString();
    const varData = {
      data: cipherDoc,
      encritption: true
    }
    if (config[config.env].apiEncryption) {
      return varData
    } else {
      return data
    }
  } catch (e) {
    return data;
  }
}

const getRandomFileName = (name) => {
  try {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const random = ("" + Math.random()).substring(2, 10);
    const random_number = name + '-' + timestamp + '-' + random;
    return random_number;
  } catch (e) {
    const random = (name?.toString() + Math.random()).substring(2, 10);
    return name?.toString() + random;
  }
}

const uploadToS3 = async (imageURL, name, isDelete) => {
  try {
    const s3 = new AWS.S3({
      accessKeyId: config[config.env].AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: config[config.env].AWS_S3_SECRET_ACCESS_KEY,
    })
    if (isDelete) {
      s3.deleteObject({
        Bucket: config[config.env].AWS_S3_BUCKET_NAME,
        Key: name,
      }, function (err, data) {
        console.log(err);
        return '';
      });
    } else {
      const blob = Buffer.from(imageURL.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      const uploadedImage = await s3.upload({
        Bucket: config[config.env].AWS_S3_BUCKET_NAME,
        Key: name,
        ContentEncoding: 'base64',
        Body: blob,
      }).promise();
      const varString = uploadedImage.Location;
      return varString
    }
  } catch (err) {
    console.log(err)
    return ''
  }
}

exports.updateToFile = async (name, image, isUpadted) => {
  let uniq_name = '';
  try {
    if (isUpadted) {
      if (typeof (name) === 'string') {
        uniq_name = name?.toString().slice(name.toString().lastIndexOf('/') + 1)
        // uniq_name = name.replace(config[config.env].s3ServerHost, '').replace(config[config.env].s3DelsteServerHost, '');
        return await uploadToS3(image, uniq_name, isUpadted);
      } else {
        for (let i = 0; i < name.length; i++) {
          await uploadToS3(image, name[i], isUpadted);
        }
      }
    } else {
      uniq_name = getRandomFileName(name)
      return await uploadToS3(image, uniq_name, isUpadted);
    }
  } catch (err) {
    return ''
  }
}

exports.isValidObjectId = isValidObjectId;
exports.getRandomFileName = getRandomFileName;
exports.apiEncryptionData = apiEncryptionData;