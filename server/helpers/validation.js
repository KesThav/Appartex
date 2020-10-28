const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = Joi.object({
  lastname: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  dateofbirth: Joi.date(),
  status: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
});

const buildingSchema = Joi.object({
  adress: Joi.string().required(),
  postalcode: Joi.number().min(1000).max(9999).required(),
  city: Joi.string().required(),
});

const appartSchema = Joi.object({
  size: Joi.number().required(),
  adress: Joi.string().allow(null, "").default(null),
  postalcode: Joi.number().min(1000).max(9999).allow("").default(-1),
  city: Joi.string().allow(null, "").default(null),
  building: Joi.objectId().allow(null, "").default(null),
  status: Joi.string(),
});

const contractSchema = Joi.object({
  charge: Joi.number().required(),
  rent: Joi.number().required(),
  tenant: Joi.objectId().required(),
  appartmentid: Joi.objectId().required(),
  other: Joi.string().allow("", null),
  status: Joi.string(),
});

const billSchema = Joi.object({
  tenant: Joi.objectId().required(),
  reference: Joi.string().required(),
  endDate: Joi.date().required(),
  amount: Joi.number().required(),
  reason: Joi.string().required(),
  status: Joi.objectId().required(),
});

const statusSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  userSchema,
  loginSchema,
  buildingSchema,
  appartSchema,
  contractSchema,
  billSchema,
  statusSchema,
};
