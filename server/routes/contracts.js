const Router = require("@koa/router");
const router = new Router({ prefix: "/contracts" });
const Contract = require("../models/contract.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");
let ObjectId = require("mongodb").ObjectId;
const contractValidation = require("../helpers/contractValidation");
const Appart = require("../models/appartment.model");
const Building = require("../models/building.model");

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
 *         appartmentid:
 *            type: id
 *            example: 5f954d4c94a4981bc4284277
 *         buildingid:
 *            type: id
 *            example: 5f94453d1e0ad61a448d08b5
 *         other:
 *            type: String
 *            example: Two rent paid in advance
 *         status:
 *            type: String
 *            default: Actif
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
    let allcontracts = await Contract.find({ createdBy: ctx.request.jwt._id })
      .populate("tenant")
      .populate({ path: "appartmentid", populate: { path: "building" } })
      .populate("buildingid");
    ctx.body = allcontracts;
  } catch (err) {
    ctx.throw(400, err);
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
 *     - name: contract_id
 *       in: path
 *       required: true
 *       description: the id of the contract
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

router.get("/:contractid", jwt, filterAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.contractid);
  if (!validate) return ctx.throw(404, "contract not found");
  try {
    let contractid = new ObjectId(ctx.params.contractid);
    const onecontract = await Contract.findById(contractid)
      .populate("tenant")
      .populate("appartmentid")
      .populate("buildingid");
    if (!onecontract) {
      ctx.throw(404, "contract not found");
    } else {
      ctx.body = onecontract;
    }
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /contracts/add:
 *  post :
 *    summary : Create a contract
 *    operationId : createcontract
 *    tags :
 *        - contract
 *    security:
 *        - bearerAuth: []
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Contract'
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *         description: Forbidden
 *      '500':
 *         description: Server error
 *
 */

router.post("/add", jwt, adminAccess, contractValidation, async (ctx) => {
  const {
    charge,
    rent,
    tenant,
    appartmentid,
    buildingid,
    other,
  } = ctx.request.body;
  try {
    let newcontract = new Contract({
      charge,
      rent,
      tenant,
      appartmentid,
      buildingid,
      other,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });
    if (appartmentid) {
      await Appart.findByIdAndUpdate(appartmentid, { status: "Occupé" });
    }
    if (buildingid) {
      await Building.findByIdAndUpdate(buildingid, { $inc: { counter: 1 } });
    }
    await newcontract.save();
    ctx.body = newcontract;
  } catch (err) {
    ctx.throw(500, err);
  }
  console.log("ok");
});

/**
 *  @swagger
 * /contracts/update/{contract_id}:
 *  put :
 *    summary : Update a contract
 *    operationId : updatecontract
 *    tags :
 *        - contract
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: contract_id
 *       in: path
 *       required: true
 *       description: the id of the contract
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Contract'
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Contract not found
 *      '500':
 *        description: Server error
 *
 */

router.put(
  "/update/:contractid",
  jwt,
  adminAccess,
  contractValidation,
  async (ctx) => {
    let validate = ObjectId.isValid(ctx.params.contractid);
    if (!validate) return ctx.throw(404, "No contract found");
    let contractid = new ObjectId(ctx.params.contractid);

    const contract = await Contract.findById(contractid);
    if (!contract) {
      ctx.throw(404, "No contract found");
    }

    const {
      charge,
      rent,
      tenant,
      appartmentid,
      buildingid,
      other,
    } = ctx.request.body;

    const update = { charge, rent, tenant, appartmentid, buildingid, other };
    try {
      const updatedcontract = await Contract.findByIdAndUpdate(
        contractid,
        update,
        {
          new: true,
        }
      );
      ctx.body = updatedcontract;
    } catch (err) {
      ctx.throw(500, err);
    }
  }
);

module.exports = router;
