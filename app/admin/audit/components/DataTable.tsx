"use client";

import { JSX, useEffect, useState } from "react";
import formatDateSimple from "@/app/shared/utils/formatdate-simple";
import { Card404, Datatable, DatatableSkeleton } from "@/app/shared/components";
import type { IAuditoria } from "@/app/shared/interfaces";
import cn from "@/app/shared/utils/cn";

interface IAuditsDataTable {
  audits: IAuditoria[];
}

const AuditsDataTable = ({ audits }: IAuditsDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Operación",
      selector: (row: { operacion: string }) => row.operacion,
      sortable: true,
      format: (row: { operacion: string }) => (
        <p
          className={cn(
            "px-2 py-1 text-sm font-semibold text-white rounded-md",
            row.operacion === "CREAR" || row.operacion === "AGREGAR"
              ? "bg-green-500"
              : row.operacion === "EDITAR"
              ? "bg-yellow-500"
              : row.operacion === "ELIMINAR" || row.operacion === "QUITAR"
              ? "bg-red-500"
              : "bg-gray-500"
          )}
        >
          {row.operacion}
        </p>
      ),
    },
    {
      width: "180px",
      name: "Tabla afectada",
      selector: (row: { tabla_afectada: string }) => row.tabla_afectada,
      sortable: true,
    },
    {
      name: "Identificador de Registro",
      selector: (row: { registro_tabla_id: number }) => row.registro_tabla_id,
    },
    {
      name: "Nombre de Usuario",
      selector: (row: { usuario_username: string }) => row.usuario_username,
      sortable: true,
    },
    {
      width: "300px",
      name: "Valores anteriores",
      selector: (row: { valores_anteriores: object | null }) =>
        row.valores_anteriores ? JSON.stringify(row.valores_anteriores) : "",
      format: (row: { operacion: string; valores_anteriores: object | null }) =>
        row.operacion === "ELIMINAR" ||
        row.operacion === "QUITAR" ||
        row.operacion === "EDITAR" ? (
          <pre className="max-w-[300px] max-h-[200px] p-2 overflow-x-auto">
            <code>{JSON.stringify(row.valores_anteriores, null, 2)}</code>
          </pre>
        ) : (
          "N/A"
        ),
    },
    {
      width: "300px",
      name: "Valores nuevos",
      selector: (row: { valores_nuevos: object | null }) =>
        row.valores_nuevos ? JSON.stringify(row.valores_nuevos) : "",
      format: (row: {
        operacion: string;
        valores_nuevos: object | null;
        valores_anteriores: object | null;
      }) =>
        row.operacion === "CREAR" || row.operacion === "AGREGAR" ? (
          <pre className="max-w-[300px] max-h-[200px] p-2 overflow-x-auto">
            <code>{JSON.stringify(row.valores_nuevos, null, 2)}</code>
          </pre>
        ) : row.operacion === "EDITAR" ? (
          formatJSONDiff(
            row.valores_anteriores
              ? (row.valores_anteriores as unknown as Record<
                  string,
                  string | number | null
                >)
              : null,
            row.valores_nuevos
              ? (row.valores_nuevos as unknown as Record<
                  string,
                  string | number | null
                >)
              : null
          )
        ) : (
          "N/A"
        ),
    },
    {
      width: "250px",
      name: "Creado en",
      selector: (row: { created_at: Date }) => row.created_at.toString(),
      sortable: true,
      format: (row: { created_at: Date }) =>
        formatDateSimple(row.created_at),
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-full">
      {audits.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={audits} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron auditorías."
          description="No se encontraron auditorías en la base de datos."
        />
      )}
    </div>
  );
};

export default AuditsDataTable;

const highlightDifferences = (
  oldValue: string | number | null,
  newValue: string | number | null
): JSX.Element => {
  if (oldValue === newValue) {
    return <span>{newValue}</span>;
  }
  return (
    <span className="bg-yellow-300 text-black px-1 rounded">{newValue}</span>
  );
};

const formatJSONDiff = (
  oldObj: Record<string, string | number | null> | null,
  newObj: Record<string, string | number | null> | null
): JSX.Element => {
  if (!oldObj || !newObj) {
    return <span className="text-gray-500">No disponible</span>;
  }

  return (
    <pre className="max-w-[300px] max-h-[200px] p-2 overflow-x-auto">
      <code>
        <span>{"{"}</span>
        {Object.keys(newObj).map((key) => (
          <div key={key} className="ml-4">
            <span>{`"${key}"`}:</span>{" "}
            {highlightDifferences(oldObj[key], newObj[key])}
          </div>
        ))}
        <span>{"}"}</span>
      </code>
    </pre>
  );
};
