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
  username: string;
  email: string;
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
  vocacion_id: number;
  vocacion_especifica_id: number;
  created_at: Date;
  updated_at: Date;

  situacion_fisica: ISituacionFisica;
  vocacion: IVocacion;
  vocacion_especifica: IVocacionEspecifica;

  propiedades: IPropiedad[];

  archivos: IArchivo[];
}

export interface IPropietario {
  id: number;
  nombre: string;
  rfc: string;

  archivos: IArchivo[];

  created_at: Date;
  updated_at: Date;
}

export interface IUbicacion {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface IGarantia {
  id: number;
  beneficiario: string;
  monto: number;
  fecha_inicio: Date;
  fecha_fin: Date;

  archivos: IArchivo[];

  created_at: Date;
  updated_at: Date;
}

export interface IProcesoLegal {
  id: number;
  abogado: string;
  tipo_proceso: string;
  estatus: string;
  comentarios?: string;

  archivos: IArchivo[];

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
  clasificacion?: string;
  latitud?: number;
  longitud?: number;
  created_at: Date;
  updated_at: Date;

  proyecto: IProyecto;

  propietarios: IPropietarioSociedad[];
  ubicaciones: IUbicacion[];
  garantias: IGarantia[];
  procesos_legales: IProcesoLegal[];
  rentas: IRenta[];

  archivos: IArchivo[];
}

export interface IPropietarioSociedad {
  es_socio: boolean;
  sociedad_porcentaje_participacion: number;
  propietario_id: number;
  propietario: IPropietario;
  propiedad_id: number;
  created_at: Date;
}

export interface IUbicacionPropiedad {
  ubicacion_id: number;
  propiedad_id: number;
  created_at: Date;
}

export interface IGarantiaPropiedad {
  garantia_id: number;
  propiedad_id: number;
  created_at: Date;
}

export interface IProcesoLegalPropiedad {
  proceso_legal_id: number;
  propiedad_id: number;
  created_at: Date;
}

export interface IRenta {
  id: number;
  nombre_comercial?: string;
  razon_social?: string;
  renta_sin_iva?: number;
  meses_deposito_garantia?: number;
  meses_gracia?: number;
  meses_gracia_fecha_inicio?: Date;
  meses_gracia_fecha_fin?: Date;
  meses_renta_anticipada?: number;
  renta_anticipada_fecha_inicio?: Date;
  renta_anticipada_fecha_fin?: Date;
  incremento_mes?: string;
  incremento_nota?: string;
  inicio_vigencia?: Date;
  fin_vigencia_forzosa?: Date;
  fin_vigencia_no_forzosa?: Date;
  vigencia_nota?: string;
  metros_cuadrados_rentados?: number;
  esta_disponible: boolean;
  created_at: Date;
  updated_at: Date;

  propiedades: IPropiedad[];
}

export interface IPropiedadRenta {
  propiedad_id: number;
  renta_id: number;
  created_at: Date;
}

export interface IAuditoria {
  id: number;
  operacion: string;
  tabla_afectada: string;
  registro_tabla_id: number;
  usuario_username: string;
  valores_anteriores: object | null;
  valores_nuevos: object | null;
  created_at: Date;
}

export interface IArchivo {
  id: number;
  url: string;
  proyecto_id?: number;
  propiedad_id?: number;
  propietario_id?: number;
  garantia_id?: number;
  proceso_legal_id?: number;
  created_at: Date;
}
