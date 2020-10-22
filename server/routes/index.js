const combineRouters = require("koa-combine-routers");
const authRouter = require("./auth");
const tenantRouter = require("./tenants");
const buildingRouter = require("./buildings");
const appartmentRouter = require("./appartments");
const billRouter = require("./bills");
const contractRouter = require("./contracts");
const messageRouter = require("./messages");
const taskRoute = require("./tasks");
const repairRoute = require("./repairs");

const router = combineRouters(
  authRouter,
  tenantRouter,
  buildingRouter,
  appartmentRouter,
  billRouter,
  contractRouter,
  messageRouter,
  taskRoute,
  repairRoute
);

module.exports = router;
