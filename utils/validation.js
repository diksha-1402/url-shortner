import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
import helper from "./helper.js";
import constants from "./constants.js";

const joiPassword = Joi.extend(joiPasswordExtendCore);
let message =
  "Password Should be at least 8 characters long and includes at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character. Avoid using spaces.";
const joiSignUpValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: joiPassword
      .string()
      .messages({
        "string.empty": message,
      })
      .minOfLowercase(1)
      .messages({
        "password.minOfLowercase": message,
      })
      .minOfNumeric(1)
      .messages({
        "password.minOfNumeric": message,
      })
      .minOfUppercase(1)
      .messages({
        "password.minOfUppercase": message,
      })
      .minOfSpecialCharacters(1)
      .messages({
        "password.minOfSpecialCharacters": message,
      })
      .noWhiteSpaces()
      .messages({
        "password.noWhiteSpaces": message,
      })
      .min(8)
      .messages({
        "string.min": message,
      })
      .required()
      .messages({
        "any.required": message,
      }),

    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Password and confirm password not matched" }),

    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

const joiLoginValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: joiPassword
      .string()
      .messages({
        "string.empty": message,
      })
      .minOfLowercase(1)
      .messages({
        "password.minOfLowercase": message,
      })
      .minOfNumeric(1)
      .messages({
        "password.minOfNumeric": message,
      })
      .minOfUppercase(1)
      .messages({
        "password.minOfUppercase": message,
      })
      .minOfSpecialCharacters(1)
      .messages({
        "password.minOfSpecialCharacters": message,
      })
      .noWhiteSpaces()
      .messages({
        "password.noWhiteSpaces": message,
      })
      .min(8)
      .messages({
        "string.min": message,
      })
      .required(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

const joiShortUrlValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    longUrl: Joi.string().required(),
    user_info: Joi.object().optional(),
    shortUrl: Joi.string().allow("", null).optional(),
    alias: Joi.string().allow("", null).optional(),
    topic: Joi.string().allow("", null).optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

const commonValidator = {
  joiSignUpValidator: joiSignUpValidator,
  joiLoginValidator: joiLoginValidator,
  joiShortUrlValidator: joiShortUrlValidator,
};

export default commonValidator;
