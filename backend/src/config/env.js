import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').default(''),
  DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.number().integer().positive().default(900),
  REFRESH_TOKEN_TTL_DAYS: Joi.number().integer().positive().default(7),
  BCRYPT_COST: Joi.number().integer().min(10).max(15).default(12),
  CORS_ORIGIN: Joi.string().required(),
  UPLOAD_DIR: Joi.string().default('uploads'),
  MAX_UPLOAD_SIZE: Joi.number().integer().positive().default(10485760),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
    .default('info'),
}).unknown(true);

const { value, error } = schema.validate(process.env, { abortEarly: false });

if (error) {
  const details = error.details.map((item) => `${item.path.join('.')}: ${item.message}`).join('\n');
  throw new Error(`Konfigurasi environment tidak valid:\n${details}`);
}

export const env = Object.freeze({
  ...value,
  isProduction: value.NODE_ENV === 'production',
  isTest: value.NODE_ENV === 'test',
  corsOrigins: value.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
});