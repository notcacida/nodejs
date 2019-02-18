const joi = require('joi');

exports.validateBody = schema => {
  return (req, res, next) => {
    let result = joi.validate(req.body, schema);

    if (result.error) {
      return res.status(400).json(result.error);
    }

    if (!req.value) {
      req.value = {};
    }
    req.value['body'] = result.value;
    next();
  };
};

exports.schemas = {
  authSchema: joi.object().keys({
    email: joi
      .string()
      .email()
      .required(),
    password: joi.string().required(),

    name: joi.string().required()
  }),
  loginSchema: joi.object().keys({
    email: joi
      .string()
      .email()
      .required(),
    password: joi.string().required()
  })
};
