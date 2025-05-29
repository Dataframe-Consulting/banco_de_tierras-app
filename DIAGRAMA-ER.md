# Diagrama Entidad-Relación

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    VOCACION     │       │ SITUACION_FISICA│       │VOCACION_ESPECIF │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ 🔑 id           │       │ 🔑 id           │       │ 🔑 id           │
│    valor        │       │    nombre       │       │    valor        │
│    created_at   │       │    created_at   │       │    created_at   │
│    updated_at   │       │    updated_at   │       │    updated_at   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                          │                          │
         │                          │                          │
         │ N:1                      │ N:1                      │ N:1
         │                          │                          │
         └──────────────────────────┼──────────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │    PROYECTO     │
                          ├─────────────────┤
                          │ 🔑 id           │
                          │    nombre       │
                          │ superficie_total│
                          │    esta_activo  │
                          │    comentarios  │
                          │ 🔗 situacion_fisica_id│
                          │ 🔗 vocacion_id  │
                          │ 🔗 vocacion_especifica_id│
                          │    created_at   │
                          │    updated_at   │
                          └─────────────────┘
                                    │
                                    │ 1:N
                                    │
                                    ▼
                          ┌─────────────────┐
                          │   PROPIEDAD     │
                          ├─────────────────┤
                          │ 🔑 id           │
                          │    nombre       │
                          │    superficie   │
                          │ valor_comercial │
                          │ anio_valor_comercial│
                          │ clave_catastral │
                          │   base_predial  │
                          │  adeudo_predial │
                          │anios_pend_predial│
                          │   comentarios   │
                          │ 🔗 proyecto_id  │
                          │   created_at    │
                          │   updated_at    │
                          └─────────────────┘
                                    │
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        │                           │                           │
        ▼                           │                           ▼
┌─────────────────┐                 │                 ┌─────────────────┐
│  PROPIETARIO    │                 │                 │    UBICACION    │
├─────────────────┤                 │                 ├─────────────────┤
│ 🔑 id           │                 │                 │ 🔑 id           │
│    nombre       │                 │                 │    nombre       │
│    rfc          │                 │                 │    created_at   │
│    created_at   │                 │                 │    updated_at   │
│    updated_at   │                 │                 └─────────────────┘
└─────────────────┘                 │                           │
        │                           │                           │
        │ N:M                       │                           │ N:M
        │                           │                           │
        ▼                           │                           ▼
┌─────────────────┐                 │                 ┌─────────────────┐
│PROPIETARIO_PROP │                 │                 │UBICACION_PROP   │
├─────────────────┤                 │                 ├─────────────────┤
│🔗 propietario_id│                 │                 │🔗 ubicacion_id  │
│🔗 propiedad_id  │                 │                 │🔗 propiedad_id  │
│   es_socio      │                 │                 │   created_at    │
│sociedad_porcentaje│               │                 └─────────────────┘
│   created_at    │                 │
└─────────────────┘                 │
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           │                           ▼
┌─────────────────┐                 │                 ┌─────────────────┐
│    GARANTIA     │                 │                 │ PROCESO_LEGAL   │
├─────────────────┤                 │                 ├─────────────────┤
│ 🔑 id           │                 │                 │ 🔑 id           │
│  beneficiario   │                 │                 │    abogado      │
│     monto       │                 │                 │ tipo_proceso    │
│ fecha_inicio    │                 │                 │    estatus      │
│  fecha_fin      │                 │                 │  comentarios    │
│   created_at    │                 │                 │   created_at    │
│   updated_at    │                 │                 │   updated_at    │
└─────────────────┘                 │                 └─────────────────┘
        │                           │                           │
        │ N:M                       │                           │ N:M
        │                           │                           │
        ▼                           │                           ▼
┌─────────────────┐                 │                 ┌─────────────────┐
│GARANTIA_PROP    │                 │                 │PROCESO_LEGAL_   │
├─────────────────┤                 │                 │   PROPIEDAD     │
│🔗 garantia_id   │                 │                 ├─────────────────┤
│🔗 propiedad_id  │                 │                 │🔗proceso_legal_id│
│   created_at    │                 │                 │🔗 propiedad_id  │
└─────────────────┘                 │                 │   created_at    │
                                    │                 └─────────────────┘
                                    │
                                    │                 ┌─────────────────┐
                                    │                 │     RENTA       │
                                    │                 ├─────────────────┤
                                    │                 │ 🔑 id           │
                                    │                 │nombre_comercial │
                                    │                 │  razon_social   │
                                    │                 │ renta_sin_iva   │
                                    │                 │meses_deposito_garantia│
                                    │                 │  meses_gracia   │
                                    │                 │meses_gracia_fecha_*│
                                    │                 │meses_renta_anticipada│
                                    │                 │renta_anticipada_*│
                                    │                 │ incremento_mes  │
                                    │                 │ incremento_nota │
                                    │                 │ inicio_vigencia │
                                    │                 │fin_vigencia_*   │
                                    │                 │ vigencia_nota   │
                                    │                 │esta_disponible  │
                                    │                 │metros_cuadrados_*│
                                    │                 │   created_at    │
                                    │                 │   updated_at    │
                                    │                 └─────────────────┘
                                    │                           │
                                    │                           │ N:M
                                    │                           │
                                    │                           ▼
                                    │                 ┌─────────────────┐
                                    │                 │PROPIEDAD_RENTA  │
                                    │                 ├─────────────────┤
                                    │                 │🔗 propiedad_id  │
                                    │                 │🔗 renta_id      │
                                    │                 │   created_at    │
                                    │                 └─────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │     ARCHIVO     │
                          ├─────────────────┤
                          │ 🔑 id           │
                          │     url         │
                          │🔗 proyecto_id   │
                          │🔗 propiedad_id  │
                          │🔗 propietario_id│
                          │🔗 garantia_id   │
                          │🔗proceso_legal_id│
                          │   created_at    │
                          └─────────────────┘

┌─────────────────┐                          ┌─────────────────┐
│      USER       │                          │   AUDITORIA     │
├─────────────────┤                          ├─────────────────┤
│ 🔑 id           │                          │ 🔑 id           │
│   username      │                          │   operacion     │
│    email        │                          │ tabla_afectada  │
│hashed_password  │                          │registro_tabla_id│
│   created_at    │                          │usuario_username │
│   updated_at    │                          │valores_anteriores│
└─────────────────┘                          │ valores_nuevos  │
                                             │   created_at    │
                                             └─────────────────┘

LEYENDA:
🔑 = Clave Primaria
🔗 = Clave Foránea
N:M = Relación Muchos a Muchos
N:1 = Relación Muchos a Uno
1:N = Relación Uno a Muchos
```

## 📋 **Resumen de relaciones:**

### **Entidades Principales:**
- **PROYECTO** (centro del sistema) → Contiene múltiples propiedades
- **PROPIEDAD** → Entidad principal de negocio  
- **PROPIETARIO** → Dueños de las propiedades
- **RENTA** → Contratos de arrendamiento
- **GARANTIA** → Garantías financieras
- **PROCESO_LEGAL** → Gestión legal

### **Catálogos:**
- **VOCACION** / **VOCACION_ESPECIFICA** → Clasificación de uso de suelo
- **SITUACION_FISICA** → Estado físico de proyectos
- **UBICACION** → Ubicaciones geográficas

### **Sistemas:**
- **USER** → Autenticación y control de acceso
- **ARCHIVO** → Gestión documental (Azure Storage)
- **AUDITORIA** → Trazabilidad de cambios

### **Relaciones Clave:**
1. **Proyecto** 1:N **Propiedad** (Un proyecto tiene muchas propiedades)
2. **Propiedad** N:M **Propietario** (Propiedades pueden tener múltiples dueños)
3. **Propiedad** N:M **Renta** (Propiedades pueden tener múltiples contratos)
4. **Propiedad** N:M **Garantia** (Múltiples garantías por propiedad)
5. **Propiedad** N:M **Proceso_Legal** (Múltiples procesos legales)
6. **Archivo** puede asociarse a cualquier entidad principal