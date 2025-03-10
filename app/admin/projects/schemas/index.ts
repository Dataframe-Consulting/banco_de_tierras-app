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
  superficie_total: z
    .number({
      message: "La superficie total es requerida",
    })
    .min(0, {
      message: "La superficie total debe ser igual o mayor a 0",
    }),
  esta_activo: z.boolean({
    message: "El estatus de activo es requerido",
  }),
  comentarios: z.string().optional(),
  situacion_fisica_id: z.number({
    message: "La situación física es requerida",
  }),
  vocacion_id: z.number({
    message: "La vocación es requerida",
  }),
  vocacion_especifica_id: z.number({
    message: "La vocación específica es requerida",
  }),
});

const createSchema = baseSchema.extend({});
const updateSchema = baseSchema.extend({});

const schemas = {
  add: createSchema,
  edit: updateSchema,
};

export default function validateProjectsSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}

// CREATE TABLE IF NOT EXISTS proyecto (
//   id SERIAL PRIMARY KEY,
//   nombre VARCHAR(255) NOT NULL UNIQUE,
//   superficie_total FLOAT NOT NULL,
//   esta_activo BOOLEAN NOT NULL DEFAULT TRUE,
//   comentarios TEXT,
//   situacion_fisica_id INT NOT NULL REFERENCES situacion_fisica(id) ON DELETE CASCADE,
//   vocacion_id INT NOT NULL REFERENCES vocacion(id) ON DELETE CASCADE,
//   vocacion_especifica_id INT NOT NULL REFERENCES vocacion_especifica(id) ON DELETE CASCADE,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
