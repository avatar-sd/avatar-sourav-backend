const express = require("express");
require("./db/mongoose");
const bodyParser = require("body-parser");
const router = require("./routers");
const cors = require("cors");
const { errorMsg } = require("./utils");
const { apiDecryptionData } = require('./utils');
// const morgan = require('morgan');
// const rfs = require('rotating-file-stream');
// const fs = require('fs');
// const path = require('path');
const config = require("./config/defaultConfig");

// const publicDir = path.join(__dirname, '../public/uploads');

// if (!fs.existsSync(publicDir)) {
//   fs.mkdirSync(publicDir, { recursive: true });
// }
const app = express();

if (config.env !== 'dev') {
  app.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
  })
}

app.use(express.json({ limit: '10mb' }));
app.use(cors());


// app.use(morgan('combined', { stream: accessLogStream }))

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// app.use(passport.initialize());
// app.use(passport.session());

app.use((req, res, next) => {
  if (req.body?.data && req.body?.encritption) {
    const decryptedData = apiDecryptionData(req.body);
    req.body = decryptedData;
  }
  if (req.query?.data && req.query?.encritption) {
    const decryptedData = apiDecryptionData(req.query);
    req.query = decryptedData;
  }
  next();
});

app.use("/api", router.loginRouter);
app.use("/api", router.dashboardRouter);
// app.use("/uploads", express.static(publicDir));

app.use((req, res, next) => {
  return res.status(404).send(errorMsg(503));
});

app.use((error, req, res, next) => {
  return res.status(error.status || 500).send(errorMsg(error.message));
});

//.............middleware for error handeling...................

////////////////////////////////////////////////////////////////

module.exports = app;
