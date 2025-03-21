import z from "zod";
import validateSchema from "@/app/shared/utils/validate-schema";

const baseSchema = z.object({
  valor: z
    .string({
      message: "El valor es requerido",
    })
    .min(1, {
      message: "El valor es requerido",
    })
    .max(255, {
      message: "El valor no puede tener más de 255 caracteres",
    }),
});

const createSchema = baseSchema.extend({});
const updateSchema = baseSchema.extend({});

const schemas = {
  add: createSchema,
  edit: updateSchema,
};

export default function validateVocationSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}
