const Router = require("@koa/router");
const router = new Router({ prefix: "/contracts" });
const Contract = require("../models/contract.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
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
 *            example: Actif
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
    let allcontracts = await Contract.find({ createdBy: ctx.request.jwt._id })
      .populate("tenant")
      .populate({ path: "appartmentid", populate: { path: "building" } })
      /*       .populate("buildingid") */
      .sort({ createdAt: -1 });
    ctx.body = allcontracts;
  } catch (err) {
    ctx.throw(err);
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
 *      '404':
 *         description: Contract not found
 *      '500':
 *         description: Server error
 *
 */

router.get("/:contractid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.contractid);
  if (!validate) return ctx.throw(404, "contract not found");
  try {
    let contractid = new ObjectId(ctx.params.contractid);
    const onecontract = await Contract.findById(contractid)
      .populate("tenant")
      .populate({ path: "appartmentid", populate: { path: "building" } });
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
  const { charge, rent, tenant, appartmentid, other } = ctx.request.body;
  try {
    let newcontract = new Contract({
      charge,
      rent,
      tenant,
      appartmentid,
      other,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });

    await Appart.findByIdAndUpdate(appartmentid, { status: "Occupé" });

    const appart = await Appart.findById(appartmentid);
    if (appart.building) {
      await Building.findByIdAndUpdate(appart.building, {
        $inc: { counter: 1 },
      });
    }

    await newcontract.save();
    ctx.body = newcontract;
  } catch (err) {
    ctx.throw(500, err);
  }
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
    let contractid = new ObjectId(ctx.params.contractid);

    const contract = await Contract.findById(contractid);
    if (!contract) {
      ctx.throw(404, "contract not found");
    }

    const { charge, rent, tenant, appartmentid, other } = ctx.request.body;

    if (contract.appartmentid.status == "Occupé") {
      if (appartmentid !== contract.appartmentid) {
        ctx.throw(400, "appartment is already taken");
      }
    }
    console.log(appartmentid != contract.appartmentid);

    if (appartmentid != contract.appartmentid) {
      ctx.throw(400, "can't modify appartment, create a new contract");
    }

    const update = { charge, rent, tenant, appartmentid, other };
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

/**
 *  @swagger
 * /contracts/archive/{contract_id}:
 *  put :
 *    summary : Archive a contract
 *    operationId : archivecontract
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
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Contract not found
 *      '500':
 *        description: Server error
 *
 */

router.put("/archive/:contractid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.contractid);
  if (!validate) return ctx.throw(404, "contract not found");
  const contractid = new ObjectId(ctx.params.contractid);
  const contract = await Contract.findById(contractid);
  if (!contract) return ctx.throw(404, "contract not found");

  console.log(contract);
  try {
    await Appart.findByIdAndUpdate(contract.appartmentid, { status: "Libre" });

    const buildingid = await Appart.findById(contract.appartmentid).select({
      building: 1,
      _id: 0,
    });

    await Building.findByIdAndUpdate(buildingid.building, {
      $inc: { counter: -1 },
    });

    await Contract.findByIdAndUpdate(contractid, { status: "Archivé" });

    ctx.body = "ok";
  } catch (err) {
    ctx.throw(err);
  }
});

/**
 *  @swagger
 * /contracts/delete/{contract_id}:
 *  delete :
 *    summary : Delete a contract
 *    operationId : deletecontract
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
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Contract not found
 *      '500':
 *        description: Server error
 *
 */

router.delete("/delete/:contractid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.contractid);
  if (!validate) return ctx.throw(404, "contract not found");
  const contractid = new ObjectId(ctx.params.contractid);
  const contract = await Contract.findById(contractid);
  if (!contract) return ctx.throw(404, "contract not found");

  console.log(contract);
  try {
    await Appart.findByIdAndUpdate(contract.appartmentid, { status: "Libre" });

    const buildingid = await Appart.findById(contract.appartmentid).select({
      building: 1,
      _id: 0,
    });

    await Building.findByIdAndUpdate(buildingid.building, {
      $inc: { counter: -1 },
    });

    await Contract.findByIdAndDelete(contractid);
    ctx.body = "ok";
  } catch (err) {
    ctx.throw(err);
  }
});

module.exports = router;
