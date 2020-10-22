const Router = require("@koa/router");
const router = new Router({ prefix: "/repairs" });
const Repair = require("../models/repair.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Repair:
 *       properties:
 *         amount:
 *           type: Number
 *           example: 1996
 *         reason:
 *           type: String
 *           example: Repair
 *         taskid:
 *            type: id
 *            example: 507f1f77bcf86cd799439011
 *         status:
 *            type: String
 *            default: "En cours"
 *            example: En cours
 *       required:
 *          - amount
 *          - reason
 *          - taskid
 *
 */

router.get("/", jwt, adminAccess, async (ctx) => {
  try {
    let alltrepairs = await Repair.find({});
    ctx.status = 200;
    ctx.body = alltrepairs;
  } catch (err) {
    ctx.throw(400, error);
  }
});
module.exports = router;
