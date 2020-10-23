const Router = require("@koa/router");
const router = new Router({ prefix: "/bills" });
const Bill = require("../models/bill.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");

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
 *            type: String
 *            default: "A venir"
 *            example: A venir
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
    let allbills = await Bill.find({ createdBy: ctx.request.jwt._id });
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
 *       description: the id of the tenant of return
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

router.get("/:appartid", filterAccess, async (ctx) => {});

module.exports = router;
