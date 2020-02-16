import * as t from "io-ts";
import * as v from "../index";

console.log(
  t
    .type({
      date: v.pipe(t.string, v.isDate("yyyy-MM-dd"))
    })
    .decode({
      date: "2020-02-16"
    })
);
