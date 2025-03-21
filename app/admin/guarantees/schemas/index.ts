import z from "zod";
import validateSchema from "@/app/shared/utils/validate-schema";

const baseSchema = z.object({
  beneficiario: z
    .string({
      message: "El beneficiario es requerido",
    })
    .min(1, {
      message: "El beneficiario es requerido",
    })
    .max(255, {
      message: "El beneficiario no puede tener más de 255 caracteres",
    }),
  monto: z
    .number({
      message: "El monto es requerido",
    })
    .min(0, {
      message: "El monto debe ser igual o mayor a 0",
    }),
  fecha_inicio: z.date({
    message: "La fecha de inicio es requerida",
  }),
  fecha_fin: z.date({
    message: "La fecha de fin es requerida",
  }),
});

const createSchema = baseSchema.extend({});
const updateSchema = baseSchema.extend({});

const schemas = {
  add: createSchema,
  edit: updateSchema,
};

export default function validateGuaranteesSchema(
  action: string,
  data: unknown
) {
  return validateSchema(schemas, action, data);
}
