const Router = require("@koa/router");
const router = new Router({ prefix: "/history/tasks" });
const Taskstatus = require("../models/task_status.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
let ObjectId = require("mongodb").ObjectId;

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Task history:
 *       properties:
 *         taskid:
 *           type: id
 *           example: 5f9820a2d32a1820dc695040
 *         status:
 *           type: id
 *           example : 5f981ffb579d301330c1c38d
 *       required:
 *          - taskid
 *          - status
 *
 */

/**
 *  @swagger
 *
 *  /history/tasks:
 *  get :
 *    summary : Return all tasks histories
 *    operationId : gettasksshistories
 *    tags :
 *        - task history
 *    security:
 *        - bearerAuth: []
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *         description: Forbidden
 *      '500':
 *         description: Server error
 *
 */

router.get("/", jwt, adminAccess, async (ctx) => {
  try {
    const alltasksstatus = await Taskstatus.find({
      createdBy: ctx.request.jwt._id,
    })
      .sort({
        updatedAt: -1,
      })
      .populate({
        path: "taskid",
      })
      .populate("status", "name");
    ctx.body = alltasksstatus;
  } catch (err) {
    ctx.throw(400, err);
  }
});

/**
 *  @swagger
 * /history/tasks/{task_id}:
 *  get :
 *    summary : Return all histories of one task
 *    operationId : gettaskhistories
 *    tags :
 *        - task history
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: task_id
 *       in: path
 *       required: true
 *       description: the id of the task
 *    responses:
 *      '200':
 *        description: 'Success'
 *        content :
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Task history'
 *      '403':
 *         description: Forbidden
 *      '404':
 *        description: Task not found
 *      '500':
 *         description: Server error
 *
 */

router.get("/:billid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.billid);
  if (!validate) return ctx.throw(404, "bill not found");
  const billid = new ObjectId(ctx.params.billid);
  try {
    const bill = await Billstatus.find({ billid: billid })
      .populate({
        path: "billid",
        select: "tenant",
        populate: { path: "tenant", select: "name lastname" },
      })
      .populate("status", "name")
      .sort({ updatedAt: -1 });
    if (!bill) {
      ctx.throw(400, "bill not found");
    } else {
      ctx.body = bill;
    }
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
