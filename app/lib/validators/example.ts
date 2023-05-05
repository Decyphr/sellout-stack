import { makeDomainFunction } from "domain-functions";
import { z } from "zod";

export const exampleSchema = z.object({
  firstName: z.string().min(1),
  email: z.string().min(1).email(),
});

export const exampleMutation = makeDomainFunction(exampleSchema)(
  async (values) =>
    console.log(values) /* or anything else, like saveMyValues(values) */
);
