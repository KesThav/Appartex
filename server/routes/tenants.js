const Router = require("@koa/router");
const router = new Router({ prefix: "/tenants" });
const Tenant = require("../models/tenant.model");
let ObjectId = require("mongodb").ObjectId;
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");
const bcrypt = require("bcrypt");

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
 *            example: 17.02.1996
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
    let alltenants = await Tenant.find({});
    ctx.status = 200;
    ctx.body = alltenants;
  } catch (err) {
    ctx.throw(400, error);
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
 *       description: the id of the tenant of return
 *    responses:
 *      '200':
 *        description: 'Success'
 *        content :
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Tenant'
 *      '403':
 *         description: Forbidden / Complete all fields / Password should be 6 characters long / Email already exist
 *      '500':
 *         description: Server error
 *
 */


router.get("/:tenantid", jwt, filterAccess, async (ctx) => {
  try {
    let tenantid = new ObjectId(ctx.params.tenantid);
    let onetenant = await Tenant.find({ _id: tenantid }).exec();
    if (!onetenant) {
      ctx.status = 402;
    } else {
      ctx.status = 200;
      ctx.body = onetenant;
    }
  } catch (err) {
    ctx.status = 404;
    ctx.body = err;
  }
});

/**
 *  @swagger
 * /tenants/add:
 *  post :
 *    summary : Créer un locataire
 *    operationId : register
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
  const { name, lastname, email, date, password } = ctx.request.body;
  if (!name || !lastname || !email || !password) {
    ctx.throw(403, "complete all field !");
  }
  if (password.trim().length < 6) {
    ctx.throw(403, "Password should be minimum 6 characters long");
  }
  const emailExist = await Tenant.find({ email });
  if (emailExist.length !== 0) {
    ctx.throw(403, `Email already exist`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    let newtenant = new Tenant({
      name,
      lastname,
      email,
      date,
      password: hashedPassword,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });
    await newtenant.save();
    ctx.body = newtenant;
  } catch (err) {
    ctx.body = err;
  }
});

module.exports = router;
