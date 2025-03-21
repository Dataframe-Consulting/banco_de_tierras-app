import z from "zod";
import validateSchema from "@/app/shared/utils/validate-schema";

const baseSchema = z.object({
  porcentaje_participacion: z
    .number({
      message: "Porcentaje de participación es requerido",
    })
    .positive({
      message: "Porcentaje de participación debe ser un número positivo",
    }),
});

const createSchema = baseSchema.extend({});
const updateSchema = baseSchema.extend({});

const schemas = {
  add: createSchema,
  edit: updateSchema,
};

export default function validateSocietiesSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}
