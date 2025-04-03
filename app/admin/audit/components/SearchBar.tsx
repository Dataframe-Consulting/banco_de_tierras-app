"use client";

import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";

const SearchBar = () => {
  const defaultFilters = {
    operacion: "",
    tabla_afectada: "",
    usuario_username: "",
    registrado_desde: "",
    registrado_hasta: "",
  };

  const { filters, handleSearch } = useSearchFilter(defaultFilters);

  return (
    <search className="max-w-lg mx-auto mt-6 mb-4">
      <div className="flex flex-col lg:flex-row justify-center gap-2 items-end">
        <div className="flex flex-col md:flex-row gap-2 items-end">
          <div>
            <GenericSearchInput
              type="select"
              id="operacion"
              placeholder="Todas"
              ariaLabel="Operación"
              value={filters.operacion}
              options={OPERACIONES.map((operacion) => ({
                value: operacion.value,
                label: operacion.label,
              }))}
              onChange={(value: string) => handleSearch("operacion", value)}
            />
          </div>
          <div>
            <GenericSearchInput
              type="select"
              id="tabla_afectada"
              placeholder="Todas"
              ariaLabel="Tabla Afectada"
              value={filters.tabla_afectada}
              options={TABLAS_AFECTADAS.map((tabla) => ({
                value: tabla.value,
                label: tabla.label,
              }))}
              onChange={(value: string) =>
                handleSearch("tabla_afectada", value)
              }
            />
          </div>
          <div>
            <GenericSearchInput
              type="select"
              id="usuario_username"
              placeholder="Todos"
              ariaLabel="Usuario"
              value={filters.usuario_username}
              options={USUARIOS_USERNAMES.map((usuario) => ({
                value: usuario.value,
                label: usuario.label,
              }))}
              onChange={(value: string) =>
                handleSearch("usuario_username", value)
              }
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div>
            <GenericSearchInput
              type="datetime-local"
              id="registrado_desde"
              placeholder="Desde"
              ariaLabel="Registrado Desde"
              value={filters.registrado_desde}
              onChange={(value: string) =>
                handleSearch("registrado_desde", value)
              }
            />
          </div>
          <div>
            <GenericSearchInput
              type="datetime-local"
              id="registrado_hasta"
              placeholder="Hasta"
              ariaLabel="Registrado Hasta"
              value={filters.registrado_hasta}
              onChange={(value: string) =>
                handleSearch("registrado_hasta", value)
              }
            />
          </div>
        </div>
      </div>
    </search>
  );
};

export default SearchBar;

const OPERACIONES = [
  { value: "CREAR", label: "Crear" },
  { value: "AGREGAR", label: "Agregar" },
  { value: "EDITAR", label: "Editar" },
  { value: "ELIMINAR", label: "Eliminar" },
  { value: "QUITAR", label: "Quitar" },
];

const TABLAS_AFECTADAS = [
  { value: "garantia", label: "Garantía" },
  { value: "proceso_legal", label: "Proceso Legal" },
  { value: "propiedad", label: "Propiedad" },
  { value: "sociedad_propiedad", label: "Sociedad en Propiedad" },
  { value: "ubicacion_propiedad", label: "Ubicación en Propiedad" },
  { value: "garantia_propiedad", label: "Garantía en Propiedad" },
  { value: "proceso_legal_propiedad", label: "Proceso Legal en Propiedad" },
  { value: "propietario", label: "Propietario" },
  { value: "socio", label: "Socio" },
  { value: "proyecto", label: "Proyecto" },
  { value: "renta", label: "Renta" },
  { value: "situacion_fisica", label: "Situación Física" },
  { value: "sociedad", label: "Sociedad" },
  { value: "ubicacion", label: "Ubicación" },
  { value: "vocacion", label: "Vocación" },
  { value: "vocacion_especifica", label: "Vocación Específica" },
];

const USUARIOS_USERNAMES = [
  { value: "caro", label: "Caro" },
  { value: "tony", label: "Tony" },
];
