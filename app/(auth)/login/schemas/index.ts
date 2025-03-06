import z from "zod";
import validateSchema from "@/app/shared/utils/validate-schema";

const baseSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

const loginSchema = baseSchema.extend({});

const schemas = {
  login: loginSchema,
};

export default function validateLoginSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}
