const Router = require("@koa/router");
const router = new Router({ prefix: "/tasks" });
const Task = require("../models/task.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const { taskSchema, messageSchema } = require("../helpers/validation");
const Taskstatus = require("../models/task_status.model");
let ObjectId = require("mongodb").ObjectId;

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
 *            type: String
 *            example: New tenant
 *         startDate:
 *            type: Date
 *            example: 2020-10-22
 *         endDate:
 *            type: Date
 *            example: 2020-10-23
 *         status:
 *            type : id
 *            default : 5f8c8096c7289130403d7e16
 *         messageid:
 *            type: id
 *            example: 5f8c8096c7289130403d7e16
 *       required:
 *          - content
 *          - title
 *          - startDate
 *          - endDate
 *          - messageid
 *          - status
 *
 */

/**
 *  @swagger
 *
 *  /tasks:
 *  get :
 *    summary : Return all tasks
 *    operationId : gettasks
 *    tags :
 *        - task
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
    let alltasks = await Task.find({ createdBy: ctx.request.jwt._id })
      .populate("status")
      .populate("messageid")
      .sort({ updatedAt: -1 });
    ctx.status = 200;
    ctx.body = alltasks;
  } catch (err) {
    ctx.throw(400, error);
  }
});

/**
 *  @swagger
 * /tasks/add:
 *  post :
 *    summary : Create a task
 *    operationId : createtask
 *    tags :
 *        - task
 *    security:
 *        - bearerAuth: []
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Task'
 *    responses:
 *      '200':
 *        description: Success
 *      '400':
 *        description: Field missing
 *      '403':
 *         description: Forbidden
 *      '500':
 *         description: Server error
 *
 */

router.post("/add", jwt, adminAccess, async (ctx) => {
  const { error } = taskSchema.validate(ctx.request.body);
  if (error) {
    ctx.throw(400, error);
  }
  const {
    content,
    title,
    startDate,
    endDate,
    status,
    messageid,
  } = ctx.request.body;

  try {
    const newtask = new Task({
      content,
      title,
      startDate,
      endDate,
      status,
      messageid,
      createdBy: ctx.request.jwt._id,
    });

    await newtask.save();

    const newtaskstatus = new Taskstatus({
      taskid: newtask._id,
      status: newtask.status,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });

    await newtaskstatus.save();

    ctx.body = newtask;
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /tasks/update/{task_id}:
 *  put :
 *    summary : Update a task
 *    operationId : updatetask
 *    tags :
 *        - task
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: task_id
 *       in: path
 *       required: true
 *       description: the id of the task
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Task'
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Task not found
 *      '500':
 *        description: Server error
 *
 */

router.put("/update/:taskid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.taskid);
  if (!validate) return ctx.throw(404, "task not found");
  const taskid = new ObjectId(ctx.params.taskid);

  const task = await Task.findById(taskid);
  if (!task) {
    ctx.throw(400, "task not found");
  }

  try {
    const updatedtask = await Task.findByIdAndUpdate(taskid, ctx.request.body, {
      new: true,
    });

    const taskstatus = new Taskstatus({
      taskid: taskid,
      status: ctx.request.body.status,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });

    await taskstatus.save();
    ctx.body = updatedtask;
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /tasks/delete/{task_id}:
 *  delete :
 *    summary : Delete a task
 *    operationId : deletetask
 *    tags :
 *        - task
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
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: task not found
 *      '500':
 *        description: Server error
 *
 */

router.delete("/delete/:taskid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.taskid);
  if (!validate) return ctx.throw(404, "task not found");
  const taskid = new ObjectId(ctx.params.taskid);

  const task = await Task.findById(taskid);
  if (!task) {
    ctx.throw(400, "task not found");
  }
  try {
    await Taskstatus.deleteMany({ taskid: taskid });
    await Task.findByIdAndDelete(taskid);
    ctx.body = "ok";
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
