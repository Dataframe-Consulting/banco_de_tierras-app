# Banco de Tierras - Web App

Aplicación web integral diseñada para la gestión completa de un banco de tierras institucional. Permite administrar:

- **🏘️ Proyectos inmobiliarios** y su cartera de propiedades.
- **🏠 Propiedades** con información detallada (superficie, valor, datos catastrales).
- **👥 Propietarios** y estructura de sociedades.
- **📄 Contratos de renta** con términos detallados.
- **⚖️ Procesos legales** y garantías financieras.
- **📍 Ubicaciones geográficas** y clasificaciones de uso de suelo.
- **📁 Documentación** asociada a cada entidad.
- **📊 Auditoría completa** de todas las operaciones.

## 🏗️ **Arquitectura**

### **Frontend - Next.js (React)**
```
📂 app/
├── 🔐 (auth)/login/           # Autenticación
├── 🏢 admin/                  # Panel administrativo
│   ├── properties/            # Gestión de propiedades
│   ├── projects/              # Gestión de proyectos
│   ├── owners/                # Gestión de propietarios
│   ├── rents/                 # Gestión de rentas
│   ├── guarantees/            # Gestión de garantías
│   ├── legal-processes/       # Procesos legales
│   ├── locations/             # Ubicaciones
│   ├── vocations/             # Vocaciones de uso
│   └── audit/                 # Auditoría
├── 🔧 shared/                 # Componentes reutilizables
│   ├── components/            # UI Components
│   ├── hooks/                 # React Hooks
│   ├── interfaces/            # TypeScript interfaces
│   └── utils/                 # Utilidades
└── 🎨 styles/                 # Estilos globales
```

### **Backend - Python/FastAPI**
- **API RESTful** hospedada en Azure Web Apps.
- **Autenticación** con sesiones y cookies.
- **Endpoints** para cada entidad del sistema.
- **Validación** de datos con Pydantic.
- **ORM** SQLAlchemy para interacción con PostgreSQL.

### **Base de Datos - PostgreSQL**
- **Hospedada en Azure Database for PostgreSQL**.
- **18 tablas** interrelacionadas.
- **Integridad referencial** con claves foráneas.
- **Auditoría automática** de cambios.

### **Almacenamiento - Azure Blob Storage**
- **URLs firmadas** para subida segura.
- **Integración directa** desde el frontend.

## 💾 **Modelo de datos**

Ver el [📊 Diagrama Entidad-Relación completo](./DIAGRAMA-ER.md)

### **Entidades principales:**

#### 🏗️ **PROYECTO**
Centro del sistema. Representa un desarrollo o conjunto de propiedades.
- Superficie total, estado activo, comentarios.
- Clasificación por vocación de uso y situación física.

#### 🏠 **PROPIEDAD** 
Unidad básica del inventario.
- Datos físicos: superficie, valor comercial, año de valuación.
- Datos fiscales: clave catastral, base predial, adeudos.
- Asociada a un proyecto específico.

#### 👥 **PROPIETARIO**
Personas físicas o morales dueñas de propiedades.
- Información básica: nombre, RFC.
- Relación con propiedades incluye % de participación y tipo de sociedad.

#### 📄 **RENTA**
Contratos de arrendamiento.
- Datos comerciales: nombre comercial, razón social.
- Términos financieros: monto, depósitos, meses de gracia.
- Vigencias y notas de incremento.

#### ⚖️ **PROCESO_LEGAL**
Gestión de aspectos legales.
- Información del abogado, tipo de proceso, estatus.
- Asociable a múltiples propiedades.

#### 💰 **GARANTIA**
Garantías financieras.
- Beneficiario, monto, fechas de vigencia.
- Asociable a múltiples propiedades.

### **Sistemas de soporte:**

#### 📁 **ARCHIVO**
Gestión documental integrada.
- URLs de Azure Storage.
- Asociable a cualquier entidad principal.

#### 📊 **AUDITORIA**
Trazabilidad completa.
- Registro de operaciones (CREATE, UPDATE, DELETE).
- Valores anteriores y nuevos en formato JSON.
- Usuario responsable y timestamp.

### **Validación de archivos adjuntos**

> [!CAUTION]
> Aunque la API no fuerza adjuntar archivos a las entidades se ha implementado un script temporal para activar/desactivar dicha validación por parte del frontend.

```bash
# Desactivar validaciones temporalmente
node toggle-file-validation.mjs false

# Reactivar validaciones
node toggle-file-validation.mjs true
```