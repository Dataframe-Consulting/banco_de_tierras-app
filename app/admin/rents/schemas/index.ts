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
  deposito_garantia_concepto: z
    .string({
      message: "El concepto del depósito de garantía es requerido",
    })
    .max(255, {
      message:
        "El concepto del depósito de garantía no puede tener más de 255 caracteres",
    })
    .optional(),
  deposito_garantia_monto: z
    .number()
    .min(0, {
      message: "El monto del depósito de garantía es requerido",
    })
    .optional(),
  meses_gracia_concepto: z
    .string()
    .max(255, {
      message:
        "El concepto de los meses de gracia no puede tener más de 255 caracteres",
    })
    .optional(),
  meses_gracia_fecha_inicio: z.date().nullable().optional(),
  meses_gracia_fecha_fin: z.date().nullable().optional(),
  renta_anticipada_concepto: z
    .string()
    .max(255, {
      message:
        "El concepto de la renta anticipada no puede tener más de 255 caracteres",
    })
    .optional(),
  renta_anticipada_fecha_inicio: z.date().nullable().optional(),
  renta_anticipada_fecha_fin: z.date().nullable().optional(),
  renta_anticipada_renta_sin_iva: z
    .number()
    .min(0, {
      message: "La renta anticipada sin IVA es requerida",
    })
    .nullable()
    .optional(),
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
});

const createSchema = baseSchema.extend({});
const updateSchema = baseSchema.extend({});

const schemas = {
  add: createSchema,
  edit: updateSchema,
};

export default function validateRentsSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}

// CREATE TABLE IF NOT EXISTS renta(
//     id SERIAL PRIMARY KEY,
//     nombre_comercial VARCHAR(255) NOT NULL,
//     razon_social VARCHAR(255) NOT NULL,
//     renta_sin_iva DECIMAL(10, 2) NOT NULL,
//     deposito_garantia_concepto VARCHAR(255),
//     deposito_garantia_monto DECIMAL(10, 2),
//     meses_gracia_concepto VARCHAR(255),
//     meses_gracia_fecha_inicio DATE,
//     meses_gracia_fecha_fin DATE,
//     renta_anticipada_concepto VARCHAR(255),
//     renta_anticipada_fecha_inicio DATE,
//     renta_anticipada_fecha_fin DATE,
//     renta_anticipada_renta_sin_iva FLOAT,
//     incremento_mes VARCHAR(255) NOT NULL,
//     incremento_nota VARCHAR(255),
//     inicio_vigencia DATE NOT NULL,
//     fin_vigencia_forzosa DATE NOT NULL,
//     fin_vigencia_no_forzosa DATE,
//     vigencia_nota VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
