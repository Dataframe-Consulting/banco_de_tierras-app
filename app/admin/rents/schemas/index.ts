import z from "zod";
import validateSchema from "@/app/shared/utils/validate-schema";

const baseSchema = z.object({
  nombre_comercial: z
    .string({
      message: "El nombre comercial es requerido",
    })
    .min(1, {
      message: "El nombre comercial es requerido",
    })
    .max(255, {
      message: "El nombre comercial no puede tener más de 255 caracteres",
    }),
  razon_social: z
    .string({
      message: "La razón social es requerida",
    })
    .min(1, {
      message: "La razón social es requerida",
    })
    .max(255, {
      message: "La razón social no puede tener más de 255 caracteres",
    }),
  renta_sin_iva: z
    .number({
      message: "La renta sin IVA es requerida",
    })
    .min(0, {
      message: "La renta sin IVA debe ser igual o mayor a 0",
    }),
  meses_deposito_garantia: z
    .number({
      message: "El número de meses de depósito de garantía es requerido",
    })
    .min(0, {
      message: "El número de meses de depósito de garantía debe ser mayor o igual a 0",
    })
    .max(10, {
      message:
        "El número de meses de depósito de garantía no puede ser mayor a 10",
    }),
  meses_gracia: z
    .number({
      message: "El número de meses de gracia es requerido",
    })
    .min(0, {
      message: "El número de meses de gracia debe ser mayor o igual a 0",
    })
    .max(10, {
      message:
        "El número de meses de gracia no puede ser mayor a 10",
    }),
  meses_gracia_fecha_inicio: z.date().nullable().optional(),
  meses_gracia_fecha_fin: z.date().nullable().optional(),
  meses_renta_anticipada: z
    .number({
      message: "El número de meses de renta anticipada es requerido",
    })
    .min(0, {
      message: "El número de meses de renta anticipada debe ser mayor o igual a 0",
    })
    .max(10, {
      message:
        "El número de meses de renta anticipada no puede ser mayor a 10",
    }),
  renta_anticipada_fecha_inicio: z.date().nullable().optional(),
  renta_anticipada_fecha_fin: z.date().nullable().optional(),
  incremento_mes: z
    .string({
      message: "El incremento por mes es requerido",
    })
    .min(1, {
      message: "El incremento por mes es requerido",
    })
    .max(255, {
      message: "El incremento por mes no puede tener más de 255 caracteres",
    }),
  incremento_nota: z
    .string()
    .max(255, {
      message: "La nota del incremento no puede tener más de 255 caracteres",
    })
    .optional(),
  inicio_vigencia: z.date({
    message: "La fecha de inicio de vigencia es requerida",
  }),
  fin_vigencia_forzosa: z.date({
    message: "La fecha de fin de vigencia forzosa es requerida",
  }),
  fin_vigencia_no_forzosa: z.date().nullable().optional(),
  vigencia_nota: z
    .string()
    .max(255, {
      message: "La nota de la vigencia no puede tener más de 255 caracteres",
    })
    .optional(),
  metros_cuadrados_rentados: z
    .number({
      message: "Los metros cuadrados rentados son requeridos",
    })
    .positive({
      message: "Los metros cuadrados rentados deben ser mayores a 0",
    })
    .optional(),
});

const createSchema = baseSchema.extend({});
const updateSchema = baseSchema.extend({});
const createDisponibleSchema = z.object({ esta_disponible: z.boolean() });

const schemas = {
  add: createSchema,
  edit: updateSchema,
  addDisponible: createDisponibleSchema,
};

export default function validateRentsSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}
