import z from "zod";
import validateSchema from "@/app/shared/utils/validate-schema";

const baseSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es requerido",
    })
    .min(1, {
      message: "El nombre es muy corto",
    })
    .max(255, {
      message: "El nombre es muy largo",
    }),
});

const createSchema = baseSchema.extend({});
const updateSchema = baseSchema.extend({});

const schemas = {
  add: createSchema,
  edit: updateSchema,
};

export default function validatePhysicalSituationsSchema(
  action: string,
  data: unknown
) {
  return validateSchema(schemas, action, data);
}
