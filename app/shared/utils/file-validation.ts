/**
 * Configuración para controlar las validaciones de archivos obligatorios.
 * Cambia REQUIRE_FILES_ON_CREATE a false para desactivar temporalmente.
 */
export const FILE_VALIDATION_CONFIG = {
  REQUIRE_FILES_ON_CREATE: false, // Cambiar a false para desactivar temporalmente
} as const;

/**
 * Valida si se requieren archivos para una acción específica.
 * 
 * @param action - Acción del formulario ('add', 'edit', 'delete')
 * @param files - Lista de archivos seleccionados
 * @returns Error de validación o null si es válido
 */
export function validateRequiredFiles(
  action: string,
  files: FileList | null
): { files?: string } | null {
  // Solo validar en acción de crear y si está habilitada la validación
  if (action !== "add" || !FILE_VALIDATION_CONFIG.REQUIRE_FILES_ON_CREATE) {
    return null;
  }

  if (
    !files ||
    files.length === 0 ||
    Array.from(files).some((file) => file.size === 0)
  ) {
    return {
      files: "No se han seleccionado archivos",
    };
  }

  return null;
} 