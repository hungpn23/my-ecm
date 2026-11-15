import { type } from "arktype";

export const ServiceName = type("string").narrow(
  (s, ctx): s is `${string}-service` => s.endsWith("-service") || ctx.mustBe("a string ending with '-service'"),
);
