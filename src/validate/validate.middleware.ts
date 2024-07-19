import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import pick from "../utils/pick";
import Joi from "joi";

const validate = (schema: Record<string, any>) => {
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

export default validate;
