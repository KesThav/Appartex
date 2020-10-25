const Router = require("@koa/router");
const router = new Router({ prefix: "/tenants" });
const Tenant = require("../models/tenant.model");
const Contract = require("../models/contract.model");
const Bill = require("../models/bill.model");
const Appart = require("../models/appartment.model");
const Building = require("../models/building.model");
let ObjectId = require("mongodb").ObjectId;
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");
const bcrypt = require("bcrypt");
const { userSchema } = require("../helpers/validation");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Tenant:
 *       properties:
 *         name:
 *           type: String
 *           example: Patrick
 *         lastname:
 *           type: string
 *           example: Bruel
 *         email:
 *           type: String
 *           example: Jean@paul.com
 *         password:
 *            type: String
 *            minimum: 6
 *            example: 1a3b5c
 *         status:
 *            type: String
 *            default: "Actif"
 *            example: Actif
 *         dateofbirth:
 *            type: Date
 *            example: 1996-02-17
 *       required:
 *          - name
 *          - lastname
 *          - email
 *          - password
 *
 */

/**
 *  @swagger
 *
 *  /tenants:
 *  get :
 *    summary : Return all tenants
 *    operationId : gettenants
 *    tags :
 *        - tenant
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
    let alltenants = await Tenant.find({
      createdBy: ctx.request.jwt._id,
    }).sort({ createdAt: -1 });
    ctx.body = alltenants;
  } catch (err) {
    ctx.throw(500, error);
  }
});

/**
 *  @swagger
 * /tenants/{tenant_id}:
 *  get :
 *    summary : Return one tenant
 *    operationId : getonetenant
 *    tags :
 *        - tenant
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: tenant_id
 *       in: path
 *       required: true
 *       description: the id of the tenant
 *    responses:
 *      '200':
 *        description: 'Success'
 *        content :
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Tenant'
 *      '403':
 *         description: Forbidden / Complete all fields / Password should be 6 characters long / Email already exist
 *      '404':
 *         description: Tenant not found
 *      '500':
 *         description: Server error
 *
 */

router.get("/:tenantid", jwt, filterAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.tenantid);
  if (!validate) return ctx.throw(404, "tenant not found");
  try {
    let tenantid = new ObjectId(ctx.params.tenantid);
    const onetenant = await Tenant.findById(tenantid).exec();
    if (!onetenant) {
      ctx.throw(404, "tenant not found");
    } else {
      ctx.body = onetenant;
    }
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /tenants/add:
 *  post :
 *    summary : Create a tenant
 *    operationId : createtenant
 *    tags :
 *        - tenant
 *    security:
 *        - bearerAuth: []
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Tenant'
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *         description: Forbidden / Complete all fields / Password should be 6 characters long / Email already exist
 *      '500':
 *         description: Server error
 *
 */

router.post("/add", jwt, adminAccess, async (ctx) => {
  const { name, lastname, email, dateofbirth, password } = ctx.request.body;

  const { error } = userSchema.validate(ctx.request.body);
  if (error) {
    ctx.throw(400, error);
  }

  const emailExist = await Tenant.findOne({ email });
  if (emailExist) {
    ctx.throw(403, `Email already exist`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    let newtenant = new Tenant({
      name,
      lastname,
      email,
      dateofbirth,
      password: hashedPassword,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });
    await newtenant.save();
    ctx.body = newtenant;
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /tenants/update/{tenant_id}:
 *  put :
 *    summary : Update a tenant
 *    operationId : updatetenant
 *    tags :
 *        - tenant
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: tenant_id
 *       in: path
 *       required: true
 *       description: the id of the tenant
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Tenant'
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *        description: Forbidden / Complete all fields / Password should be 6 characters long / Email already exist
 *      '404':
 *        description: Tenant not found
 *      '500':
 *        description: Server error
 *
 */

router.put("/update/:tenantid", jwt, filterAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.tenantid);
  if (!validate) return ctx.throw(404, "No tenant found");
  let tenantid = new ObjectId(ctx.params.tenantid);

  const tenant = await Tenant.findOne({ _id: tenantid });
  if (!tenant) {
    ctx.throw(404, "No tenant found");
  }

  if (ctx.request.body.email) {
    const emailExist = await Tenant.findOne({ email: ctx.request.body.email });
    if (emailExist) {
      if (!(emailExist._id == ctx.params.tenantid)) {
        ctx.throw(403, `Email already exist`);
      }
    }
  }

  try {
    const updatedtenant = await Tenant.findByIdAndUpdate(
      tenantid,
      ctx.request.body,
      {
        new: true,
      }
    );
    ctx.body = updatedtenant;
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /tenants/delete/{tenant_id}:
 *  delete :
 *    summary : Delete a tenant
 *    operationId : deletetenant
 *    tags :
 *        - tenant
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: tenant_id
 *       in: path
 *       required: true
 *       description: the id of the tenant
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Tenant not found
 *      '500':
 *        description: Server error
 *
 */

router.delete("/delete/:tenantid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.tenantid);
  if (!validate) return ctx.throw(404, "No tenant found");
  let tenantid = new ObjectId(ctx.params.tenantid);
  const tenant = await Tenant.findOne({ _id: tenantid });
  if (!tenant) {
    ctx.throw(404, "No tenant found");
  }
  try {
    const deletedbills = await Bill.deleteMany({ tenant: tenantid });
    const appartid = await Contract.find({ tenant: tenantid }).select(
      "appartmentid"
    );
    for (i = 0; i < appartid.length; i++) {
      Appart.findByIdAndUpdate(appartid[i], { status: "Libre" }, { new: true });
    }
    const buildingid = await Contract.find({ tenant: tenantid }).select(
      "buildingid"
    );
    for (i = 0; i < buildingid.length; i++) {
      Appart.findByIdAndUpdate(
        buildingid[i],
        { counter: counter - 1 },
        { new: true }
      );
    }

    const deletedcontract = await Contract.deleteMany({ tenant: tenantid });
    const deletedtenant = await Tenant.findByIdAndDelete(tenantid);
    ctx.body = [
      deletedtenant,
      appartid,
      buildingid,
      deletedbills,
      deletedcontract,
    ];
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
