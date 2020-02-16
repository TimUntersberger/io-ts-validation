import * as t from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import { isBoolean } from "./validators";

type GetTypeReturnValue<T> = T extends t.Type<any, infer U> ? U : unknown;

/**
 * Creates a new io-ts type, which is used for validating the input
 *
 * @param validator A function that given a value returns whether it is valid.
 * @param getErrorMessage A function that given the key of the context returns an error message.
 * @param encode A function that transformes the value to a value
 */

type DefaultType = {
  __tag: "defaultType";
};

type Validator<T, U> = t.Type<GetTypeReturnValue<T>, U, unknown>;

export const createValidator = <R = DefaultType>(
  validator: (value: any) => boolean,
  getErrorMessage: (key: string) => string,
  encode?: (value: any) => R
) => {
  return <
    T extends t.Any,
    U = R extends DefaultType ? GetTypeReturnValue<T> : R
  >(
    type: T
  ): Validator<T, U> =>
    new t.Type(
      "validator",
      type.is,
      function(value, c) {
        const key = c[1].key;
        const either = pipe(
          type.decode(value),
          E.map(x => {
            return value && validator(x)
              ? t.success(this.encode(x))
              : t.failure(value, c, getErrorMessage(key));
          }),
          E.mapLeft(errors => {
            if (type.name === "validator") {
              return t.failures(errors);
            }

            if (validator(value)) {
              return t.success(this.encode(value));
            }

            return t.failure(value, c, getErrorMessage(key));
          })
        );
        // Have to cast as any, because the wrong type gets infered
        return E.getOrElse<t.Errors, any>(x => x)(either as any);
      },
      value => {
        return encode ? encode(type.encode(value)) : type.encode(value);
      }
    );
};

export type LengthOfTuple<T extends any[]> = T extends { length: infer L }
  ? L
  : never;
export type DropFirstInTuple<T extends any[]> = ((...args: T) => any) extends (
  arg: any,
  ...rest: infer U
) => any
  ? U
  : T;
export type LastInTuple<T extends any[]> = T[LengthOfTuple<
  DropFirstInTuple<T>
>];

export function pipe<T, U1>(b: T, v1: (t: T) => U1): U1;
export function pipe<T, U1, U2>(b: T, v1: (t: T) => U1, v2: (t: U1) => U2): U2;
export function pipe<T, U1, U2, U3>(
  b: T,
  v1: (t: T) => U1,
  v2: (t: U1) => U2,
  v3: (t: U2) => U3
): U3;
export function pipe<T, U1, U2, U3, U4>(
  b: T,
  v1: (t: T) => U1,
  v2: (t: U1) => U2,
  v3: (t: U2) => U3,
  v4: (t: U3) => U4
): U4;
export function pipe<T, U1, U2, U3, U4, U5>(
  b: T,
  v1: (t: T) => U1,
  v2: (t: U1) => U2,
  v3: (t: U2) => U3,
  v4: (t: U3) => U4,
  v5: (t: U4) => U5
): U5;
export function pipe<T, U1, U2, U3, U4, U5, U6>(
  b: T,
  v1: (t: T) => U1,
  v2: (t: U1) => U2,
  v3: (t: U2) => U3,
  v4: (t: U3) => U4,
  v5: (t: U4) => U5,
  v6: (t: U5) => U6
): U6;
export function pipe(
  b: t.Any,
  v: (t: t.Any) => t.Any,
  ...vs: ((t: t.Any) => t.Any)[]
): t.Any {
  let curr = v(b);

  for (const validator of vs) {
    curr = curr.pipe(validator(b));
  }

  return curr;
}
