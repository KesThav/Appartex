const Router = require("@koa/router");
const router = new Router({ prefix: "/appartments" });
const Appart = require("../models/appartment.model");
const Building = require("../models/building.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
let ObjectId = require("mongodb").ObjectId;
const appartValidation = require("../helpers/appartValidation");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Appartment:
 *       properties:
 *         size:
 *           type: Number
 *           example: 14
 *         adress:
 *           type: string
 *           example: Rte de Pérolles 21
 *         building:
 *           type: id
 *           example: 507f1f77bcf86cd799439011
 *         picture:
 *            type: String
 *            example: www.image.com/mykitty.png
 *       required:
 *          - size
 *          - adress
 *
 */

/**
 *  @swagger
 *
 *  /appartments:
 *  get :
 *    summary : Return all appartments
 *    operationId : getappartment
 *    tags :
 *        - appartment
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
    let allapparts = await Appart.find({
      createdBy: ctx.request.jwt._id,
    })
      .populate("building")
      .sort({ createdAt: -1 });
    ctx.body = allapparts;
  } catch (err) {
    ctx.throw(400, error);
  }
});

/**
 *  @swagger
 * /appartments/{appart_id}:
 *  get :
 *    summary : Return one appartment
 *    operationId : getoneappart
 *    tags :
 *        - appartment
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: appart_id
 *       in: path
 *       required: true
 *       description: the id of the appartment
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
 *         description: Appartment not found
 *      '500':
 *         description: Server error
 *
 */

router.get("/:appartid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.appartid);
  if (!validate) return ctx.throw(404, "appartment not found");
  try {
    let appartid = new ObjectId(ctx.params.appartid);
    const oneappart = await Appart.findById(appartid).populate("building");
    if (!oneappart) {
      ctx.throw(404, "appartment not found");
    } else {
      ctx.body = oneappart;
    }
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /appartments/add:
 *  post :
 *    summary : Create a Appartment
 *    operationId : createappartment
 *    tags :
 *        - appartment
 *    security:
 *        - bearerAuth: []
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Appartment'
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *         description: Forbidden / Complete all fields
 *      '500':
 *         description: Server error
 *
 */

router.post("/add", jwt, adminAccess, appartValidation, async (ctx) => {
  const { size, adress, building } = ctx.request.body;

  try {
    let newappart = new Appart({
      size,
      adress,
      building,
      createdBy: new ObjectId(ctx.request.jwt._id),
    });
    if (building) {
      await Building.findByIdAndUpdate(building, {
        $inc: { numberofAppart: 1 },
      });
    }
    await newappart.save();
    ctx.body = newappart;
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /appartments/update/{appart_id}:
 *  put :
 *    summary : Update a appartment
 *    operationId : updateappartment
 *    tags :
 *        - appartment
 *    security:
 *        - bearerAuth: []
 *    parameters:
 *     - name: appart_id
 *       in: path
 *       required: true
 *       description: the id of the appartment
 *    requestBody :
 *     required: true
 *     content :
 *       application/json:
 *          schema:
 *            $ref: '#/components/schemas/Appartment'
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

router.put(
  "/update/:appartid",
  jwt,
  adminAccess,
  appartValidation,
  async (ctx) => {
    let validate = ObjectId.isValid(ctx.params.appartid);
    if (!validate) return ctx.throw(404, "appartment not found");
    let appartid = new ObjectId(ctx.params.appartid);

    const appart = await Appart.findById(appartid);
    if (!appart) {
      ctx.throw(404, "appartment not found");
    }

    const { size, adress, building } = ctx.request.body;

    const update = { size, building, adress };
    try {
      const updatedappart = await Appart.findByIdAndUpdate(appartid, update, {
        new: true,
      });
      ctx.body = updatedappart;
    } catch (err) {
      ctx.throw(500, err);
    }
  }
);

module.exports = router;
