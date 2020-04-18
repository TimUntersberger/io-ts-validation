import * as t from "io-ts";
import { pipe as _pipe } from "fp-ts/lib/pipeable";

/**
 * Creates a new io-ts type, which is used for validating the input
 *
 * @param validator A function that given a value returns whether it is valid.
 * @param getErrorMessage A function that given the key of the context returns an error message.
 * @param encode A function that transformes the value to a value
 */

type Validator<TInput, TOutput> = t.Type<TOutput, TInput, unknown>;

export const createValidator = <I, O = any>(
  validator: (value: I) => boolean,
  getErrorMessage: (key: string) => string,
  encode?: (value: I) => O
) => {
  return (new t.Type<I, O, O>(
    "validator",
    t.any.is,
    function (value, c) {
      const key = c[1].key;

      if (validator(value as any)) {
        return t.success(this.encode(value));
      } else {
        return t.failure(value, c, getErrorMessage(key));
      }
    },
    (value: any) => {
      return encode ? encode(value) : value;
    }
  ) as any) as Validator<I, O>;
};

export function pipe<I1, O1>(v1: Validator<I1, O1>): Validator<I1, O1>;
export function pipe<I1, O1, O2>(
  v1: Validator<I1, O1>,
  v2: Validator<O1, O2>
): Validator<I1, O2>;
export function pipe<O1, I1, O2 extends I1, I2, O3 extends I2, I3>(
  v1: Validator<I1, O1>,
  v2: Validator<I2, O2>,
  v3: Validator<I3, O3>
): Validator<I1, O2 extends O3 ? O2 : O3>;
export function pipe<I1, O1, O2, O3, O4>(
  v1: Validator<I1, O1>,
  v2: Validator<O1, O2>,
  v3: Validator<O2, O3>,
  v4: Validator<O3, O4>
): Validator<I1, O4>;
export function pipe<I1, O1, O2, O3, O4, O5>(
  v1: Validator<I1, O1>,
  v2: Validator<O1, O2>,
  v3: Validator<O2, O3>,
  v4: Validator<O3, O4>,
  v5: Validator<O4, O5>
): Validator<I1, O5>;
export function pipe<I1, O1, O2, O3, O4, O5, O6>(
  v1: Validator<I1, O1>,
  v2: Validator<O1, O2>,
  v3: Validator<O2, O3>,
  v4: Validator<O3, O4>,
  v5: Validator<O4, O5>,
  v6: Validator<O5, O6>
): Validator<I1, O6>;
export function pipe(...vs: Validator<t.Any, t.Any>[]): t.Any {
  let curr: t.Any;

  for (const v of vs) {
    if (curr) curr = curr.pipe(v);
    else curr = v;
  }

  return curr;
}
