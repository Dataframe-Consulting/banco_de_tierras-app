import z from "zod";
import validateSchema from "@/app/shared/utils/validate-schema";

const baseSchema = z.object({
  nombre: z
    .string({
      message: "El nombre es requerido",
    })
    .min(1, {
      message: "El nombre es requerido",
    })
    .max(255, {
      message: "El nombre no puede tener más de 255 caracteres",
    }),
});

const createSchema = baseSchema.extend({});
const updateSchema = baseSchema.extend({});

const schemas = {
  add: createSchema,
  edit: updateSchema,
};

export default function validatePartnersSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}
