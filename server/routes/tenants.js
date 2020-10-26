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
 *         description: Forbidden
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
 *      '400':
 *        description : Field missing
 *      '403':
 *         description: Forbidden
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
    ctx.throw(400, `Email already exist`);
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
 *        description: Forbidden
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
        ctx.throw(400, `Email already exist`);
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
  let buildingid = [];
  let validate = ObjectId.isValid(ctx.params.tenantid);
  if (!validate) return ctx.throw(404, "No tenant found");
  let tenantid = new ObjectId(ctx.params.tenantid);
  const tenant = await Tenant.findById(tenantid);
  if (!tenant) {
    ctx.throw(404, "No tenant found");
  }
  try {
    await Bill.deleteMany({ tenant: tenantid });

    //change appartment statut
    const appartid = await Contract.find({ tenant: tenantid }).select({
      appartmentid: 1,
      _id: 0,
    });

    for (i = 0; i < appartid.length; i++) {
      await Appart.findByIdAndUpdate(
        appartid[i].appartmentid,
        { status: "Libre" },
        { new: true }
      );
    }

    //decrement building counter
    for (i = 0; i < appartid.length; i++) {
      if (appartid[i].appartmentid) {
        buildingid.push(
          await Appart.findById(appartid[i].appartmentid).select({
            building: 1,
            _id: 0,
          })
        );
      }
    }

    for (i = 0; i < buildingid.length; i++) {
      if (buildingid[i].building) {
        await Building.findByIdAndUpdate(buildingid[i].building, {
          $inc: { counter: -1 },
        });
      }
    }

    await Contract.deleteMany({ tenant: tenantid });
    await Tenant.findByIdAndDelete(tenantid);
    ctx.body = "ok";
  } catch (err) {
    ctx.throw(500, err);
  }
});

/*########################################################## Tenant endpoints #####################################################################################*/
/**
 *  @swagger
 * /tenants/buildings/{tenant_id}:
 *  get :
 *    summary : Return tenant building
 *    operationId : gettenantbuilding
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
 *              $ref: '#/components/schemas/Building'
 *      '403':
 *         description: Forbidden
 *      '404':
 *         description: No building found
 *      '500':
 *         description: Server error
 *
 */

router.get("/buildings/:tenantid", jwt, filterAccess, async (ctx) => {
  let buildings = [];
  let validate = ObjectId.isValid(ctx.params.tenantid);
  if (!validate) return ctx.throw(404, "no building found");
  try {
    let tenantid = new ObjectId(ctx.params.tenantid);
    const buildingid = await Contract.find({ tenant: tenantid }).select({
      buildingid: 1,
      _id: 0,
    });

    for (i = 0; i < buildingid.length; i++) {
      buildings.push(await Building.findById(buildingid[i].buildingid));
    }

    if (!buildingid) {
      ctx.throw(404, "no building found");
    } else {
      ctx.body = buildings;
    }
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /tenants/appartments/{tenant_id}:
 *  get :
 *    summary : Return tenant appartment
 *    operationId : gettenantappartment
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
 *              $ref: '#/components/schemas/Appartment'
 *      '403':
 *         description: Forbidden
 *      '404':
 *         description: No appartment found
 *      '500':
 *         description: Server error
 *
 */

router.get("/appartments/:tenantid", jwt, filterAccess, async (ctx) => {
  let appartments = [];
  let validate = ObjectId.isValid(ctx.params.tenantid);
  if (!validate) return ctx.throw(404, "no appartment found");
  try {
    let tenantid = new ObjectId(ctx.params.tenantid);
    const appartid = await Contract.find({ tenant: tenantid }).select({
      appartmentid: 1,
      _id: 0,
    });

    for (i = 0; i < appartid.length; i++) {
      if (appartid[i].appartmentid !== null) {
        appartments.push(await Appart.findById(appartid[i].appartmentid));
      }
    }

    if (!appartid) {
      ctx.throw(404, "no appartment found");
    } else {
      ctx.body = appartments;
    }
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /tenants/contracts/{tenant_id}:
 *  get :
 *    summary : Return tenant contracts
 *    operationId : gettenantcontract
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
 *              $ref: '#/components/schemas/Contract'
 *      '403':
 *         description: Forbidden
 *      '404':
 *         description: No contract found
 *      '500':
 *         description: Server error
 *
 */

router.get("/contracts/:tenantid", jwt, filterAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.tenantid);
  if (!validate) return ctx.throw(404, "no contract found");
  try {
    let tenantid = new ObjectId(ctx.params.tenantid);
    const contracts = await Contract.find({ tenant: tenantid })
      .populate("appartmentid", "adress")
      .populate("buildingid", "adress postalcode city");

    if (!contracts) {
      ctx.throw(404, "no contract found");
    } else {
      ctx.body = contracts;
    }
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
