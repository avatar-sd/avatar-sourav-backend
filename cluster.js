const cluster = require("cluster");
const http = require("http");
const { setupMaster } = require("@socket.io/sticky");
const { setupPrimary } = require("@socket.io/cluster-adapter");
const recluster = require("recluster");
const path = require("path");
const config = require("./src/config/defaultConfig");

const httpServer = http.createServer();

// setup sticky sessions
setupMaster(httpServer, {
  loadBalancingMethod: "least-connection",
});

// setup connections between the workers
setupPrimary();

// needed for packets containing buffers (you can ignore it if you only send plaintext objects)
// Node.js < 16.0.0
// cluster.setupMaster({
//   serialization: "advanced",
// });
// Node.js > 16.0.0
// cluster.setupPrimary({
//   serialization: "advanced",
// });

httpServer.listen(process.env.PORT ? process.env.PORT : config[config.env].port);

const balancer = recluster(path.join(__dirname, "worker.js"));

balancer.run();