const Router = require("@koa/router");
const router = new Router({ prefix: "/bills" });
const Bill = require("../models/bill.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const billValidation = require("../helpers/billValidation");
const { billSchema } = require("../helpers/validation");
const Billstatus = require("../models/bill_status.model");
let ObjectId = require("mongodb").ObjectId;

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Bill:
 *       properties:
 *         tenant:
 *           type: id
 *           example: 507f1f77bcf86cd799439011
 *         reference:
 *           type: String
 *           example: DC-134
 *         endDate:
 *           type: Date
 *           example: 2021-02-17
 *         amount:
 *           type: Number
 *           example: 1994
 *         reason:
 *            type: String
 *            example: Rent
 *         status:
 *            type: id
 *            example: 507f1f77bcf86cd799439011
 *       required:
 *          - tenant
 *          - endDate
 *          - amount
 *          - reason
 *
 */

/**
 *  @swagger
 *
 *  /bills:
 *  get :
 *    summary : Return all bills
 *    operationId : getbills
 *    tags :
 *        - bill
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
    let allbills = await Bill.find({ createdBy: ctx.request.jwt._id })
      .populate("status", "name")
      .populate("tenant", "name lastname")
      .sort({ createdAt: -1 });
    ctx.body = allbills;
  } catch (err) {
    ctx.throw(400, error);
  }
});

/**
 *  @swagger
 * /bills/{bill_id}:
 *  get :
 *    summary : Return one bill
 *    operationId : getonebill
 *    tags :
 *        - bill
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: appart_id
 *       in: path
 *       required: true
 *       description: the id of the bill
 *    responses:
 *      '200':
 *        description: 'Success'
 *        content :
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Bill'
 *      '403':
 *         description: Forbidden
 *      '500':
 *         description: Server error
 *
 */

router.get("/:billid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.billid);
  if (!validate) return ctx.throw(404, "bill not found");
  const billid = new ObjectId(ctx.params.billid);
  try {
    const bill = await Bill.findById(billid)
      .populate("status", "name")
      .populate("tenant", "name lastname");
    if (!bill) {
      ctx.throw(400, "Bill not found");
    } else {
      ctx.body = bill;
    }
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /bills/add:
 *  post :
 *    summary : Create a bill
 *    operationId : createbill
 *    tags :
 *        - bill
 *    security:
 *        - bearerAuth: []
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Bill'
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

router.post("/add", jwt, adminAccess, billValidation, async (ctx) => {
  const {
    tenant,
    reference,
    endDate,
    amount,
    reason,
    status,
  } = ctx.request.body;
  try {
    const newbill = new Bill({
      tenant,
      reference,
      endDate,
      amount,
      reason,
      status,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });

    await newbill.save();

    const newbillstatus = new Billstatus({
      billid: newbill._id,
      status: newbill.status,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });

    await newbillstatus.save();

    ctx.body = newbill;
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /bills/update/{bill_id}:
 *  put :
 *    summary : Update a status
 *    operationId : updatestatus
 *    tags :
 *        - bill
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: bill_id
 *       in: path
 *       required: true
 *       description: the id of the bill
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Bill'
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Status not found
 *      '500':
 *        description: Server error
 *
 */

router.put("/update/:billid", jwt, adminAccess, billValidation, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.billid);
  if (!validate) return ctx.throw(404, "bill not found");
  const billid = new ObjectId(ctx.params.billid);

  const bill = await Bill.findById(billid);
  if (!bill) {
    ctx.throw(400, "bill not found");
  }

  const {
    tenant,
    reference,
    endDate,
    amount,
    reason,
    status,
  } = ctx.request.body;

  const update = { tenant, reference, endDate, amount, reason, status };
  try {
    const updatedbill = await Bill.findByIdAndUpdate(billid, update, {
      new: true,
    });

    const billstatus = new Billstatus({
      billid: billid,
      status: update.status,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });

    await billstatus.save();
    ctx.body = updatedbill;
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /bills/delete/{bill_id}:
 *  delete :
 *    summary : Delete a bill
 *    operationId : deletebill
 *    tags :
 *        - bill
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: bill_id
 *       in: path
 *       required: true
 *       description: the id of the bill
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Bill not found
 *      '500':
 *        description: Server error
 *
 */

router.delete("/delete/:billid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.billid);
  if (!validate) return ctx.throw(404, "bill not found");
  const billid = new ObjectId(ctx.params.billid);

  const bill = await Bill.findById(billid);
  if (!bill) {
    ctx.throw(400, "bill not found");
  }
  try {
    await Billstatus.deleteMany({ billid: billid });
    await Bill.findByIdAndDelete(billid);
    ctx.body = "ok";
  } catch (err) {
    ctx.throw(500, err);
  }
});
module.exports = router;
