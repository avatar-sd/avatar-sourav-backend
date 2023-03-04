const envConfig = require("./appConfig");
const config = {
  env: envConfig.env,
  pageDataCount: 10,
  pageChatCount: 10,
  maxCreatedPost: 5,
  maxImgUploadCount: 3,
  bookingStatus: ["requested", "confirmed", "rejected", "cancelled"],
  dev: {
    port: 443,
    nPort: 80,
    // mongoUri: "mongodb://localhost:27017/avatar",
    mongoUri: `mongodb://test:test@ac-l7bwl9g-shard-00-00.weurt76.mongodb.net:27017,ac-l7bwl9g-shard-00-01.weurt76.mongodb.net:27017,ac-l7bwl9g-shard-00-02.weurt76.mongodb.net:27017/?ssl=true&replicaSet=atlas-7fd56v-shard-0&authSource=admin&retryWrites=true&w=majority`,
    gmailId: "",
    gmailPassword: "",
    optTime: 60 * 15,
    expTime: 60 * 60 * 24 * 365, //365days
    tempExpTime: 60 * 60 * 24 * 30, //30days
    saltRound: 10,
    accessTokenSecret:
      "43bbdb701e3e9d343ace43ff9df842451109039c3b75df25d9b883ded0512d336bdcaeae5b68ccf763279d9ea0aa739db668d7ef2adc9c92b3ceb19de9621ce7",
    accessTokenTime: "180d",
    refressTokenSecret:
      "6ad5e0898ed3fff0b0c48a2b9231ba60d0a55b2b5d4bfda8a173b9616cfc686ccd3009306c8425d981fcbebd1e4dade2ea0a2b95bd3104161ad0b998f7f9703c",
    refreshTokenTime: "60d",
    jwtSecret: "efrtergfdfgfs#ddsdfcjfyretfds",
    cryptoSecret: "sdrtergfdfgfsssdsdfcjfyret@dd",
    resetPasswordUrl: "",
    resetPasswordValidity: 15,
    otpLimit: 500,
    apiEncryption: false,
  },
  uat: {
    port: 443,
    nPort: 80,
    // mongoUri: "mongodb://localhost:27017/avatar",
    mongoUri: `mongodb://test:test@ac-l7bwl9g-shard-00-00.weurt76.mongodb.net:27017,ac-l7bwl9g-shard-00-01.weurt76.mongodb.net:27017,ac-l7bwl9g-shard-00-02.weurt76.mongodb.net:27017/?ssl=true&replicaSet=atlas-7fd56v-shard-0&authSource=admin&retryWrites=true&w=majority`,
    gmailId: "",
    gmailPassword: "",
    optTime: 60 * 15,
    expTime: 60 * 60 * 24 * 365, //365days
    tempExpTime: 60 * 60 * 24 * 30, //30days
    saltRound: 10,
    accessTokenSecret:
      "43bbdb701e3e9d343ace43ff9df842451109039c3b75df25d9b883ded0512d336bdcaeae5b68ccf763279d9ea0aa739db668d7ef2adc9c92b3ceb19de9621ce7",
    accessTokenTime: "30m",
    refressTokenSecret:
      "6ad5e0898ed3fff0b0c48a2b9231ba60d0a55b2b5d4bfda8a173b9616cfc686ccd3009306c8425d981fcbebd1e4dade2ea0a2b95bd3104161ad0b998f7f9703c",
    refreshTokenTime: "60d",
    jwtSecret: "efrtergfdfgfs#ddsdfcjfyretfds",
    cryptoSecret: "sdrtergfdfgfsssdsdfcjfyret@dd",
    resetPasswordUrl: "",
    resetPasswordValidity: 15,
    otpLimit: 500,
    apiEncryption: false,
  },
  prod: {
    port: 443,
    nPort: 80,
    mongoUri: `mongodb://test:test@ac-l7bwl9g-shard-00-00.weurt76.mongodb.net:27017,ac-l7bwl9g-shard-00-01.weurt76.mongodb.net:27017,ac-l7bwl9g-shard-00-02.weurt76.mongodb.net:27017/?ssl=true&replicaSet=atlas-7fd56v-shard-0&authSource=admin&retryWrites=true&w=majority`,
    gmailId: "",
    gmailPassword: "",
    optTime: 60 * 15,
    expTime: 60 * 60 * 24 * 365, //365days
    tempExpTime: 60 * 60 * 24 * 30, //30days
    saltRound: 10,
    accessTokenSecret:
      "43bbdb701e3e9d343ace43ff9df842451109039c3b75df25d9b883ded0512d336bdcaeae5b68ccf763279d9ea0aa739db668d7ef2adc9c92b3ceb19de9621ce7",
    accessTokenTime: "30m",
    refressTokenSecret:
      "6ad5e0898ed3fff0b0c48a2b9231ba60d0a55b2b5d4bfda8a173b9616cfc686ccd3009306c8425d981fcbebd1e4dade2ea0a2b95bd3104161ad0b998f7f9703c",
    refreshTokenTime: "60d",
    jwtSecret: "efrtergfdfgfs#ddsdfcjfyretfds",
    cryptoSecret: "sdrtergfdfgfsssdsdfcjfyret@dd",
    resetPasswordUrl: "",
    resetPasswordValidity: 15,
    otpLimit: 5,
    apiEncryption: true,
  },
};

module.exports = config;
