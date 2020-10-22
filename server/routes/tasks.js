const Router = require("@koa/router");
const router = new Router({ prefix: "/tasks" });
const Task = require("../models/task.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Task:
 *       properties:
 *         content:
 *           type: String
 *           example: Cleaning
 *         title:
 *            type: title
 *            example: New tenant
 *         startDate:
 *            type: Date
 *            example: 18.10.2020
 *         endDate:
 *            type: Date
 *            example: 19.10.2020
 *         status:
 *            type : String
 *            default : Créer
 *         messageid:
 *            type: id
 *            example: 5f8c8096c7289130403d7e16
 *       required:
 *          - content
 *          - title
 *          - startDate
 *          - endDate
 *          - messageid
 *
 */

router.get("/", jwt, adminAccess, async (ctx) => {
  try {
    let alltasks = await Task.find({});
    ctx.status = 200;
    ctx.body = alltasks;
  } catch (err) {
    ctx.throw(400, error);
  }
});

module.exports = router;
