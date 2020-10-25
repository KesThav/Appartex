const Contract = require("../models/contract.model");
const Building = require("../models/building.model");
const Appart = require("../models/appartment.model");
const Tenant = require("../models/tenant.model");
let ObjectId = require("mongodb").ObjectId;
const { contractSchema } = require("./validation");

module.exports = async (ctx, next) => {
  const {
    charge,
    rent,
    tenant,
    appartmentid,
    buildingid,
    other,
  } = ctx.request.body;
  const { error } = contractSchema.validate(ctx.request.body);
  if (error) {
    ctx.throw(400, error);
  }
  if (appartmentid && buildingid) {
    ctx.throw(400, "Appartment and building can't be filled at the same time");
  }
  if (!appartmentid && !buildingid) {
    ctx.throw(400, "Appartment and building can't be empty at the same time");
  }
  if (buildingid) {
    const building = new ObjectId(buildingid);
    const onebuilding = await Building.findById(building);
    if (!onebuilding) {
      ctx.throw(400, "building not found");
    }
  }
  if (appartmentid) {
    const appart = new ObjectId(appartmentid);
    const oneappart = await Appart.findById(appart);
    if (!oneappart) {
      ctx.throw(400, "appartment not found");
    }
    if (oneappart.status == "Occupé") {
      ctx.throw(400, "appartment is already taken");
    }
  }
  const tenantid = new ObjectId(tenant);
  const onetenant = await Tenant.findById(tenantid);
  if (!onetenant) {
    ctx.throw(400, "tenant not found");
  }
  if (onetenant.status == "Inactif") {
    ctx.throw(400, "can't use inactive tenant");
  }

  await next();
};
