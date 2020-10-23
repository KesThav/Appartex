const Router = require("@koa/router");
const router = new Router({ prefix: "/buildings" });
const Building = require("../models/building.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");
let ObjectId = require("mongodb").ObjectId;
const { buildingSchema } = require("../helpers/validation");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Building:
 *       properties:
 *         numberofAppart:
 *           type: Number
 *           example: 14
 *         adress:
 *           type: string
 *           example: Rte de Pérolles 21
 *         postalcode:
 *           type: Number
 *           minimum : 4
 *           maximum : 4
 *           example: 1700
 *         city:
 *            type: String
 *            example: Fribourg
 *       required:
 *          - numberofAppart
 *          - adress
 *          - postalcode
 *          - city
 *
 */

/**
 *  @swagger
 *
 *  /buildings:
 *  get :
 *    summary : Return all buildings
 *    operationId : getbuildings
 *    tags :
 *        - building
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
    let allbuildings = await Building.find({ createdBy: ctx.request.jwt._id });
    ctx.body = allbuildings;
  } catch (err) {
    ctx.throw(400, error);
  }
});

/**
 *  @swagger
 * /buildings/{building_id}:
 *  get :
 *    summary : Return one building
 *    operationId : getonebuilding
 *    tags :
 *        - building
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: building_id
 *       in: path
 *       required: true
 *       description: the id of the building
 *    responses:
 *      '200':
 *        description: 'Success'
 *        content :
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Building'
 *      '403':
 *         description: Forbidden
 *      '500':
 *         description: Server error
 *
 */

router.get("/:buildingid", jwt, filterAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.buildingid);
  console.log(ctx.params.buildingid);
  if (!validate) return ctx.throw(404, "building not found");
  try {
    let buildingid = new ObjectId(ctx.params.buildingid);
    const onebuilding = await Building.find({ _id: buildingid }).exec();
    ctx.body = onebuilding;
    if (onebuilding.length == 0) {
      ctx.throw(404, "Building not found");
    } else {
      ctx.body = onebuilding;
    }
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /buildings/add:
 *  post :
 *    summary : Create a building
 *    operationId : createbuilding
 *    tags :
 *        - building
 *    security:
 *        - bearerAuth: []
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Building'
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *         description: Forbidden / Complete all fields
 *      '500':
 *         description: Server error
 *
 */

router.post("/add", jwt, adminAccess, async (ctx) => {
  const { numberofAppart, adress, postalcode, city } = ctx.request.body;
  const { error } = buildingSchema.validate(ctx.request.body);
  if (error) {
    ctx.throw(400, error);
  }

  try {
    let newbuilding = new Building({
      numberofAppart,
      adress,
      postalcode,
      city,
      counter: 0,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });
    await newbuilding.save();
    ctx.body = newbuilding;
  } catch (err) {
    ctx.throw(500, err);
  }
});

router.put("/update/:buildingid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.buildingid);
  if (!validate) return ctx.throw(404, "No building found");
  let buildingid = new ObjectId(ctx.params.buildingid);

  const building = await Building.find({ _id: buildingid });
  if (building.length == 0) {
    ctx.throw(404, "No building found");
  }

  const { numberofAppart, adress, postalcode, city } = ctx.request.body;

  const { error } = buildingSchema.validate(ctx.request.body);
  if (error) {
    ctx.throw(400, error);
  }
  const emailExist = await Tenant.find({ email });
  if (emailExist.length !== 0) {
    ctx.throw(403, `Email already exist`);
  }

  const update = { numberofAppart, adress, postalcode, city };
  try {
    const updatedtenant = await Tenant.findByIdAndUpdate(buildingid, update, {
      new: true,
    });
    ctx.body = updatedtenant;
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
