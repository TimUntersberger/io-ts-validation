import * as t from "io-ts";
import * as e from "fp-ts/lib/Either";
import * as v from "../src";

const schema = t.type({
  date: v.isDate("yyyy-MM-dd"),
});

const result = schema.decode({});

if (e.isRight(result)) {
  const decoded = result.right;
  console.log(decoded.date.getTime());
} else {
  const errors = result.left;
  console.log(errors);
}
