const Router = require("@koa/router");
const router = new Router({ prefix: "/appartments" });
const Appart = require("../models/appartment.model");
const Building = require("../models/building.model");
const Contract = require("../models/contract.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
let ObjectId = require("mongodb").ObjectId;
const appartValidation = require("../helpers/appartValidation");
const multer = require("@koa/multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/appartment");
  },
  filename: function (req, file, cb) {
    let type = file.originalname.split(".")[1];
    let filename = file.originalname.split(".")[0];
    cb(null, `${filename}-${Date.now().toString(16)}.${type}`);
  },
});

const limits = {
  fields: 10,
  fileSize: 500 * 1024,
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
  limits,
});

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
      .sort({ updatedAt: -1 });
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
 *    summary : Create an appartment
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

router.post(
  "/add",
  jwt,
  adminAccess,
  appartValidation,
  upload.array("file"),
  async (ctx) => {
    const { size, adress, city } = ctx.request.body;
    let { building, postalcode } = ctx.request.body;

    console.log(ctx.request.body);
    if (building == "") {
      building = undefined;
    }

    if (postalcode == "") {
      postalcode = -1;
    }
    try {
      let newappart = new Appart({
        size,
        adress,
        postalcode,
        city,
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
  }
);

/**
 *  @swagger
 * /appartments/update/{appart_id}:
 *  put :
 *    summary : Update an appartment
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
    const checkifbuilding = await Appart.findById(appartid).select({
      building: 1,
      _id: 0,
    });

    const { size, adress, building, postalcode, city } = ctx.request.body;

    const update = { size, building, adress, postalcode, city };
    try {
      //if there's not building and we add one
      if (!checkifbuilding.building && building) {
        if (appart.status == "Libre") {
          await Building.findByIdAndUpdate(building, {
            $inc: { numberofAppart: 1 },
          });
        }
        if (appart.status == "Occupé") {
          await Building.findByIdAndUpdate(building, {
            $inc: { numberofAppart: 1, counter: 1 },
          });
        }
      }

      //if there's a building but we remove it
      if (checkifbuilding.building && !building) {
        if (appart.status == "Libre") {
          await Building.findByIdAndUpdate(checkifbuilding.building, {
            $inc: { numberofAppart: -1 },
          });
        }
        if (appart.status == "Occupé") {
          await Building.findByIdAndUpdate(checkifbuilding.building, {
            $inc: { numberofAppart: -1, counter: -1 },
          });
        }
      }

      await Appart.findByIdAndUpdate(appartid, update, {
        new: true,
      });

      //changing building id
      if (checkifbuilding.building !== building) {
        if (appart.status == "Libre") {
          await Building.findByIdAndUpdate(checkifbuilding.building, {
            $inc: { numberofAppart: -1 },
          });
          await Building.findByIdAndUpdate(building, {
            $inc: { numberofAppart: 1 },
          });
        }
        if (appart.status == "Occupé") {
          await Building.findByIdAndUpdate(checkifbuilding.building, {
            $inc: { numberofAppart: -1, counter: -1 },
          });
          await Building.findByIdAndUpdate(building, {
            $inc: { numberofAppart: 1, counter: 1 },
          });
        }
      }
      ctx.body = "ok";
    } catch (err) {
      ctx.throw(500, err);
    }
  }
);

/**
 *  @swagger
 * /appartments/delete/{appart_id}:
 *  delete :
 *    summary : Delete an appartment
 *    operationId : deleteappartment
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
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Appartment not found
 *      '500':
 *        description: Server error
 *
 */

router.delete("/delete/:appartid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.appartid);
  if (!validate) return ctx.throw(404, "appartment not found");
  let appartid = new ObjectId(ctx.params.appartid);

  const appart = await Appart.findById(appartid);
  if (!appart) {
    ctx.throw(404, "appartment not found");
  }

  try {
    if (appart.building) {
      if (appart.status == "Occupé") {
        await Building.findByIdAndUpdate(appart.building, {
          $inc: { counter: -1, numberofAppart: -1 },
        });
      }
      if (appart.status == "Libre") {
        await Building.findByIdAndUpdate(appart.building, {
          $inc: { numberofAppart: -1 },
        });
      }
    }

    await Contract.findOneAndDelete({ appartmentid: appartid });

    await Appart.findByIdAndDelete(appartid);

    ctx.body = "ok";
  } catch (err) {
    ctx.throw(500, err);
  }
});

/**
 *  @swagger
 * /appartments/upload/{appart_id}:
 *  put :
 *    summary : Add image to appartment
 *    operationId : addimageappartment
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
 *       multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              picture:
 *                type: string
 *                format: binary
 *            required:
 *              - picture
 *    responses:
 *      '200':
 *        description: 'Success'
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Appartment not found
 *      '500':
 *        description: Server error
 *
 */

router.put(
  "/upload/:appartid",
  jwt,
  adminAccess,
  upload.array("picture"),
  async (ctx) => {
    let validate = ObjectId.isValid(ctx.params.appartid);
    if (!validate) return ctx.throw(404, "appartment not found");
    let appartid = new ObjectId(ctx.params.appartid);

    const appart = await Appart.findById(appartid);
    if (!appart) {
      ctx.throw(404, "appartment not found");
    }
    try {
      for (i = 0; i < ctx.files.length; i++) {
        await Appart.findByIdAndUpdate(appartid, {
          $push: {
            picture: ctx.files[i].path
              .replace(/\\/g, "/")
              .replace("public/", ""),
          },
        });
      }
      ctx.body = "ok";
    } catch (err) {
      ctx.throw(500, err);
    }
  }
);

/**
 *  @swagger
 * /appartments/delete/file/{appart_id}:
 *  put :
 *    summary : delete image from appartment
 *    operationId : deleteimageappartment
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
 *            type: object
 *            properties:
 *              picture:
 *                type: string
 *                example: appartment/random-image.png
 *            required:
 *              - picture
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

router.put("/delete/file/:appartid", jwt, adminAccess, async (ctx) => {
  let validate = ObjectId.isValid(ctx.params.appartid);
  if (!validate) return ctx.throw(404, "appartment not found");
  let appartid = new ObjectId(ctx.params.appartid);

  const appart = await Appart.findById(appartid);
  if (!appart) {
    ctx.throw(404, "appartment not found");
  }

  try {
    await Appart.findByIdAndUpdate(appartid, {
      $pull: { picture: ctx.request.body.picture },
    });
    ctx.body = "ok";
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
