export interface IGenericPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface IGenericIcon {
  size?: string;
  customClass?: string;
  strokeWidth?: number;
  isFilled?: boolean;
}

export interface IUser {
  // id: number;
  username: string;
  email: string;
}

export interface IPropietario {
  id: number;
  nombre: string;
  rfc: string;
  socios: ISocio[];
  created_at: Date;
  updated_at: Date;
}

export interface ISocio {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPropietarioSocio {
  propietario_id: number;
  socio_id: number;
  created_at: Date;
}

export interface ISociedad {
  id: number;
  porcentaje_participacion: number;
  created_at: Date;
  updated_at: Date;
}

export interface ISituacionFisica {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface IVocacion {
  id: number;
  valor: string;
  created_at: Date;
  updated_at: Date;
}

export interface IVocacionEspecifica {
  id: number;
  valor: string;
  created_at: Date;
  updated_at: Date;
}

export interface IProyecto {
  id: number;
  nombre: string;
  superficie_total: number;
  esta_activo: boolean;
  comentarios?: string;
  situacion_fisica_id: number;
  situacion_fisica: ISituacionFisica;
  vocacion_id: number;
  vocacion: IVocacion;
  vocacion_especifica_id: number;
  vocacion_especifica: IVocacionEspecifica;
  propietarios: IPropietario[];
  sociedades: ISociedadProyecto[];
  created_at: Date;
  updated_at: Date;
}

export interface IPropietarioProyecto {
  propietario_id: number;
  proyecto_id: number;
  created_at: Date;
}

export interface ISociedadProyecto {
  valor: number;
  sociedad_id: number;
  sociedad: ISociedad;
  proyecto_id: number;
  created_at: Date;
}

export interface IUbicacion {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPropiedad {
  id: number;
  nombre: string;
  superficie: number;
  valor_comercial: number;
  anio_valor_comercial?: number;
  clave_catastral: string;
  base_predial: number;
  adeudo_predial?: number;
  anios_pend_predial?: number;
  comentarios?: string;
  proyecto_id: number;
  proyecto: IProyecto;
  ubicaciones: IUbicacion[];
  created_at: Date;
  updated_at: Date;
}

export interface IUbicacionPropiedad {
  ubicacion_id: number;
  propiedad_id: number;
  created_at: Date;
}

export interface IGarantia {
  id: number;
  beneficiario: string;
  monto: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  propiedad: IPropiedad;
  propiedad_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IProcesoLegal {
  id: number;
  abogado: string;
  tipo_proceso: string;
  estatus: string;
  propiedad: IPropiedad;
  propiedad_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IRenta {
  id: number;
  nombre_comercial: string;
  razon_social: string;
  renta_sin_iva: number;
  deposito_garantia_concepto?: string;
  deposito_garantia_monto?: number;
  meses_gracia_concepto?: string;
  meses_gracia_fecha_inicio?: Date;
  meses_gracia_fecha_fin?: Date;
  renta_anticipada_concepto?: string;
  renta_anticipada_fecha_inicio?: Date;
  renta_anticipada_fecha_fin?: Date;
  renta_anticipada_renta_sin_iva?: number;
  incremento_mes: string;
  incremento_nota?: string;
  inicio_vigencia: Date;
  fin_vigencia_forzosa: Date;
  fin_vigencia_no_forzosa?: Date;
  vigencia_nota?: string;
  propiedades: IPropiedad[];
  created_at: Date;
  updated_at: Date;
}

export interface IPropiedadRenta {
  propiedad_id: number;
  renta_id: number;
  created_at: Date;
}
