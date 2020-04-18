import { createValidator } from "./validation";
import EmailValidator from "isemail";
import * as d from "date-fns";

export const required = createValidator(
  (value) => {
    return value != null && value != undefined;
  },
  (key) => `${key} is required`
);

export const minLength = (length: number) =>
  createValidator(
    (value) => value.length >= length,
    (key) => `${key} has to be at least ${length} characters long`
  );

export const maxLength = (length: number) =>
  createValidator(
    (value) => value.length <= length,
    (key) => `${key} can't be longer than ${length} characters`
  );

export const isNumber = createValidator(
  (value) => !isNaN(value),
  (key) => `${key} has to be a number`,
  Number
);

export const isPositiveNumber = createValidator(
  (value) => value >= 0,
  (key) => `${key} has to be a positive number`,
  Number
);

export const isBoolean = createValidator(
  (value) => value === "true" || value === "false",
  (key) => `${key} has to be a boolean`,
  Boolean
);

export const isDate = (format: string) =>
  createValidator(
    (value) => d.isValid(d.parse(value, format, 0)),
    (key) => `${key} has to be a date`,
    (value) => {
      return d.parse(value, format, 0);
    }
  );

export const isEmail = createValidator(
  EmailValidator.validate,
  (key) => `${key} has to be an email`
);
