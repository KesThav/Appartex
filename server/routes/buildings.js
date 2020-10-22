const Router = require("@koa/router");
const router = new Router({ prefix: "/buildings" });
const Building = require("../models/building.model");
const jwt = require("../middlewares/jwt");
const adminAccess = require("../middlewares/adminAccess");
const filterAccess = require("../middlewares/filterAccess");


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
    let allbuildings = await Building.find({});
    ctx.status = 200;
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
 *              $ref: '#/components/schemas/Building'
 *      '403':
 *         description: Forbidden
 *      '500':
 *         description: Server error
 *
 */

router.get('/:buildingid', filterAccess,async ctx => {
   
})

module.exports = router;
