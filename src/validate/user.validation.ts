import Joi from "joi";
import { validObjectId } from ".";

export const validCreateUser = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    fullname: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const validLoginUser = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required(),
  }),
};
export const validGetUser = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(validObjectId).required(),
  }),
  query: Joi.object().keys({
    type: Joi.string().valid("email", "id").required(),
  }),
};
export const validCheckExist = {
  params: Joi.object().keys({
    userId: Joi.string().custom(validObjectId).required(),
  }),
};
