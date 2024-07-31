import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import pick from "../utils/pick";
import Joi from "joi";
import { isValidObjectId } from "mongoose";

export const validate = (schema: Record<string, any>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const validSchema = await pick(schema, ["params", "query", "body"]);
    const object = await pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" } })
      .validate(object);

    if (error) {
      const errorMsg = error.details
        .map((detail: any) => detail.message)
        .join(", ");
      logger.error(errorMsg);
      return _res.status(400).json({ errorMsg });
    }
    Object.assign(req, value);
    return next();
  };
};

export const validObjectId = (value: string, helpers: any) => {
  if (isValidObjectId(value)) {
    return value;
  } else {
    return helpers.message("ID must be mongoDB ObjectId");
  }
};
