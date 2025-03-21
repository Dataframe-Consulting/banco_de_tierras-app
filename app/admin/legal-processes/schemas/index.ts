import z from "zod";
import validateSchema from "@/app/shared/utils/validate-schema";

const baseSchema = z.object({
  abogado: z
    .string({
      message: "El abogado es requerido",
    })
    .min(1, {
      message: "El abogado es requerido",
    })
    .max(255, {
      message: "El abogado no puede tener más de 255 caracteres",
    }),
  tipo_proceso: z
    .string({
      message: "El tipo de proceso es requerido",
    })
    .min(1, {
      message: "El tipo de proceso es requerido",
    })
    .max(255, {
      message: "El tipo de proceso no puede tener más de 255 caracteres",
    }),
  estatus: z
    .string({
      message: "El estatus es requerido",
    })
    .min(1, {
      message: "El estatus es requerido",
    })
    .max(255, {
      message: "El estatus no puede tener más de 255 caracteres",
    }),
  comentarios: z.string().optional(),
});

const createSchema = baseSchema.extend({});
const updateSchema = baseSchema.extend({});

const schemas = {
  add: createSchema,
  edit: updateSchema,
};

export default function validateLegalProcessesSchema(
  action: string,
  data: unknown
) {
  return validateSchema(schemas, action, data);
}
