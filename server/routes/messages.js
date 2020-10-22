const Router = require("@koa/router");
const router = new Router({ prefix: "/messages" });
const Message = require("../models/message.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Message:
 *       properties:
 *         sendedTo:
 *           type: id
 *           example: 507f1f77bcf86cd799439011
 *         content:
 *            type: String
 *            example: Welcome to Fribourg
 *         status:
 *            type: String
 *            default: "En cours"
 *            example: En cours
 *         title:
 *            type: String
 *            example: Greeting
 *       required:
 *          - sendedTo
 *          - content
 *          - status
 *          - title
 *
 */


router.get("/", jwt, adminAccess, async (ctx) => {
  try {
    let allmessages = await Message.find({});
    ctx.status = 200;
    ctx.body = allmessages;
  } catch (err) {
    ctx.throw(400, error);
  }
});

module.exports = router;
