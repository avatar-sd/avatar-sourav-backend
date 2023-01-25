const config = require("./src/config/defaultConfig");
var http = require("http");
var https = require('https');
const app = require("./src/app");

const { Server } = require("socket.io");
const fs = require('fs');
const path = require("path");
const { setupWorker } = require("@socket.io/sticky");
const { createAdapter } = require("@socket.io/cluster-adapter");

let options = {
  key: '',
  cert: ''
}

try {
  options = {
    // key: fs.readFileSync(path.join(__dirname, './cert/private.key')),
    // cert: fs.readFileSync(path.join(__dirname, './cert/certificate.crt')),
    // ca: fs.readFileSync(path.join(__dirname, './cert/ca_bundle.crt'))
  };
} catch (x) {
  console.log(x)
}

const httpServer = http.createServer(app).listen(process.env.PORT ? process.env.PORT : config[config.env].nPort);
const server = https.createServer(options, app).listen(process.env.PORT ? process.env.PORT : config[config.env].port);

const io = new Server(config.env === 'dev' ? httpServer : server, {
  cors: {
    // origin: "https://example.com",
    // allowedHeaders: ["my-custom-header"],
    methods: ["GET", "POST"],
    // credentials: true
  },
  maxHttpBufferSize: 1e8,
  // pingTimeout: 60000, // 30 minutes 
  // pingInterval: 5000  // 5 seconds
});

io.eio.maxHttpBufferSize = 1e8; // 100 MB
// io.eio.pingTimeout = 60000; // 1 minutes
// io.eio.pingInterval = 5000;  // 5 seconds

// use the cluster adapter
io.adapter(createAdapter());

// setup connection with the primary process
setupWorker(io);


// Start a TCP server listening for connections on the given port and host
// server.listen(process.env.PORT ? process.env.PORT : config[config.env].port, () => {
//   console.log(`Server running at ${process.env.PORT ? process.env.PORT : config[config.env].port}`);
// });
