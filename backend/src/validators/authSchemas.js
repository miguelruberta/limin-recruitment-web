import Joi from 'joi';

export const login = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().max(190).required(),
    password: Joi.string().min(1).max(128).required(),
  }),
};

export const refresh = {
  body: Joi.object({
    refreshToken: Joi.string().min(20).max(512).required(),
  }),
};