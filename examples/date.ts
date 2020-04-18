import * as t from "io-ts";
import * as e from "fp-ts/lib/Either";
import * as v from "../src";

const schema = t.type({
  date: v.pipe(t.string, v.isDate("yyyy-MM-dd")),
  num: v.pipe(t.string, v.isPositiveNumber),
});

const result = schema.decode({
  date: "2020-02-16",
  num: "-1",
});

if (e.isRight(result)) {
  const decoded = result.right;
  console.log(decoded.date.getTime(), decoded.num);
} else {
  const errors = result.left;
  console.log(errors);
}
