const Router = require("@koa/router");
const router = new Router({ prefix: "/contracts" });
const Contract = require("../models/contract.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Contract:
 *       properties:
 *         charge:
 *           type: Number
 *           example: 1750
 *         rent:
 *            type: Number
 *            example: 457
 *         tenant:
 *            type: id
 *            example: 507f1f77bcf86cd799439011
 *         other:
 *            type: String
 *            example: Two rent paid in advance
 *         status:
 *            type : String
 *            default : Actif
 *       required:
 *          - charge
 *          - rent
 *          - tenant
 *
 */

/**
 *  @swagger
 *
 *  /contracts:
 *  get :
 *    summary : Return all contracts
 *    operationId : getcontracts
 *    tags :
 *        - contract
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
    let allcontracts = await Contract.find({ createdBy: ctx.request.jwt._id });
    ctx.body = allcontracts;
  } catch (err) {
    ctx.throw(400, error);
  }
});

/**
 *  @swagger
 * /contracts/{contract_id}:
 *  get :
 *    summary : Return one contract
 *    operationId : getonecontract
 *    tags :
 *        - contract
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
 *              $ref: '#/components/schemas/Contract'
 *      '403':
 *         description: Forbidden
 *      '500':
 *         description: Server error
 *
 */

router.get("/:contractid", filterAccess, async (ctx) => {});

module.exports = router;
