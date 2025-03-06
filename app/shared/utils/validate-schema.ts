import { ZodObject, ZodRawShape, UnknownKeysParam } from "zod";

export default function validateSchema(
  schemas: { [key: string]: ZodObject<ZodRawShape, UnknownKeysParam> },
  action: string,
  data: unknown
) {
  const schema = schemas[action];

  if (!schema) {
    throw new Error(`Invalid action: ${action}`);
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return {};
  }

  return result.error.errors.reduce((acc: { [key: string]: string }, error) => {
    acc[error.path[0]] = error.message;
    return acc;
  }, {});
}
