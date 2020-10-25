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
  numberofAppart: Joi.number(),
  adress: Joi.string().required(),
  postalcode: Joi.number().required(),
  city: Joi.string().required(),
  counter: Joi.number(),
});

const appartSchema = Joi.object({
  size: Joi.number().required(),
  adress: Joi.string(),
  building: Joi.objectId(),
  picture: [Joi.string()],
  status: Joi.string(),
});

const contractSchema = Joi.object({
  charge: Joi.number().required(),
  rent: Joi.number().required(),
  tenant: Joi.objectId().required(),
  appartmentid: Joi.objectId(),
  buildingid: Joi.objectId(),
  other: Joi.string(),
  status: Joi.string(),
});

const billSchema = Joi.object({
  tenant: Joi.objectId().required(),
  endDate: Joi.date().required(),
  amount: Joi.number().required(),
  reason: Joi.string().required(),
  status: Joi.string(),
});

module.exports = {
  userSchema,
  loginSchema,
  buildingSchema,
  appartSchema,
  contractSchema,
  billSchema,
};
