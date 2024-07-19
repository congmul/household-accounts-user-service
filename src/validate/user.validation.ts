import Joi from "joi";

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
