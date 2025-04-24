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
  superficie: z
    .number({
      message: "La superficie es requerida",
    })
    .min(0, {
      message: "La superficie debe ser igual o mayor a 0",
    }),
  valor_comercial: z
    .number({
      message: "El valor comercial es requerido",
    })
    .min(0, {
      message: "El valor comercial debe ser igual o mayor a 0",
    }),
  anio_valor_comercial: z
    .number()
    .min(0, {
      message: "El año del valor comercial debe ser igual o mayor a 0",
    })
    .optional(),
  clave_catastral: z
    .string({
      message: "La clave catastral es requerida",
    })
    .min(1, {
      message: "La clave catastral es requerida",
    })
    .max(255, {
      message: "La clave catastral no puede tener más de 255 caracteres",
    }),
  base_predial: z
    .number({
      message: "La base predial es requerida",
    })
    .min(0, {
      message: "La base predial debe ser igual o mayor a 0",
    }),
  adeudo_predial: z
    .number()
    .min(0, {
      message: "El adeudo predial debe ser igual o mayor a 0",
    })
    .optional(),
  anios_pend_predial: z
    .number()
    .min(0, {
      message: "Los años pendientes de predial deben ser igual o mayor a 0",
    })
    .optional(),
  comentarios: z
    .string()
    .max(255, {
      message: "Los comentarios no pueden tener más de 255 caracteres",
    })
    .optional(),
  proyecto_id: z
    .number({
      message: "El proyecto es requerido",
    })
    .min(1, {
      message: "El proyecto es requerido",
    }),
});

const createSchema = baseSchema.extend({});
const updateSchema = baseSchema.extend({});

const schemas = {
  add: createSchema,
  edit: updateSchema,
};

export default function validatePropertiesSchema(
  action: string,
  data: unknown
) {
  return validateSchema(schemas, action, data);
}
