const Router = require("@koa/router");
const router = new Router({ prefix: "/contact" });
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");

router.post("/", async (ctx) => {
  console.log(ctx.req.body);
});

module.exports = router;
