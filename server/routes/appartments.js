const Router = require("@koa/router");
const router = new Router({ prefix: "/appartments" });
const Appart = require("../models/appartment.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");

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
 *  /appartements:
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
    let allapparts = await Appart.find({ createdBy: ctx.request.jwt._id });
    ctx.status = 200;
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
 *       description: the id of the tenant of return
 *    responses:
 *      '200':
 *        description: 'Success'
 *        content :
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Appartment'
 *      '403':
 *         description: Forbidden
 *      '500':
 *         description: Server error
 *
 */

router.get("/:appartid", filterAccess, async (ctx) => {});

module.exports = router;
