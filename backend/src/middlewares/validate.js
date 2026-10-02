import { ValidationError } from '../core/errors.js';

const SOURCES = ['params', 'query', 'body'];

function validateSource(source, schema, payload) {
  const { value, error } = schema.validate(payload ?? {}, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const details = error.details.map((item) => ({
      field: item.path.join('.'),
      message: item.message,
    }));
    throw new ValidationError('Data tidak valid', details);
  }

  return value;
}

export function validate(schemas = {}) {
  return (req, res, next) => {
    try {
      for (const source of SOURCES) {
        const schema = schemas[source];
        if (!schema) continue;
        req[source] = validateSource(source, schema, req[source]);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}