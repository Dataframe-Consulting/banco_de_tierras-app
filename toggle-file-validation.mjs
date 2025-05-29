/**
 * Script para alternar las validaciones de archivos obligatorios en todo el proyecto
 * Uso: node toggle-file-validation.mjs [true|false]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = 'app/shared/utils/file-validation.ts';

function toggleFileValidation(enable) {
  try {
    // Leer el archivo de configuración
    const configPath = path.join(__dirname, CONFIG_FILE);
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Actualizar el valor de REQUIRE_FILES_ON_CREATE
    const newValue = enable ? 'true' : 'false';
    content = content.replace(
      /REQUIRE_FILES_ON_CREATE:\s*(true|false)/,
      `REQUIRE_FILES_ON_CREATE: ${newValue}`
    );
    
    // Escribir el archivo actualizado
    fs.writeFileSync(configPath, content);
    
    console.log(`✅ Validaciones de archivos ${enable ? 'ACTIVADAS' : 'DESACTIVADAS'}`);
    console.log(`📝 Configuración actualizada en: ${CONFIG_FILE}`);
    
    if (!enable) {
      console.log('\n⚠️  IMPORTANTE: Las validaciones de archivos están desactivadas temporalmente.');
      console.log('   Recuerda reactivarlas cuando sea necesario.');
    }
    
  } catch (error) {
    console.error('❌ Error al actualizar la configuración:', error.message);
    process.exit(1);
  }
}

// Obtener el argumento de la línea de comandos
const arg = process.argv[2];

if (!arg || !['true', 'false'].includes(arg.toLowerCase())) {
  console.log('Uso: node toggle-file-validation.mjs [true|false]');
  console.log('  true  - Activar validaciones de archivos obligatorios');
  console.log('  false - Desactivar validaciones de archivos obligatorios');
  process.exit(1);
}

const enable = arg.toLowerCase() === 'true';
toggleFileValidation(enable); 