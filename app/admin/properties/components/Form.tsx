"use client";

import { useRouter } from "next/navigation";
import validatePropertiesSchema from "../schemas";
import { useActionState, useCallback } from "react";
import {
  GenericInput,
  SubmitButton,
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components";
import type {
  IProyecto,
  IPropiedad,
  IUbicacion,
} from "@/app/shared/interfaces";

interface IPropertiesState {
  message?: string;
  data?: {
    nombre?: string;
    superficie?: number;
    valor_comercial?: number;
    anio_valor_comercial?: number;
    clave_catastral?: string;
    base_predial?: number;
    adeudo_predial?: number;
    anios_pend_predial?: number;
    comentarios?: string;
    proyecto_id?: number;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  onClose: () => void;
  propiedad: IPropiedad | null;
  action: "add" | "edit" | "delete";
  setOptimisticData: (data: IPropiedad | null) => void;
  proyectos: IProyecto[];
  ubicaciones: IUbicacion[];
}

const Form = ({
  propiedad,
  action,
  onClose,
  setOptimisticData,
  proyectos,
  ubicaciones,
}: IForm) => {
  const router = useRouter();

  const initialState: IPropertiesState = {
    errors: {},
    message: "",
    data: propiedad,
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        nombre: formData.get("nombre")
          ? (formData.get("nombre") as string)
          : undefined,
        superficie: formData.get("superficie")
          ? parseFloat(formData.get("superficie") as string)
          : undefined,
        valor_comercial: formData.get("valor_comercial")
          ? parseFloat(formData.get("valor_comercial") as string)
          : undefined,
        anio_valor_comercial: formData.get("anio_valor_comercial")
          ? parseInt(formData.get("anio_valor_comercial") as string)
          : undefined,
        clave_catastral: formData.get("clave_catastral")
          ? (formData.get("clave_catastral") as string)
          : undefined,
        base_predial: formData.get("base_predial")
          ? parseFloat(formData.get("base_predial") as string)
          : undefined,
        adeudo_predial: formData.get("adeudo_predial")
          ? parseFloat(formData.get("adeudo_predial") as string)
          : undefined,
        anios_pend_predial: formData.get("anios_pend_predial")
          ? parseInt(formData.get("anios_pend_predial") as string)
          : undefined,
        comentarios: formData.get("comentarios")
          ? (formData.get("comentarios") as string)
          : undefined,
        proyecto_id: formData.get("proyecto_id")
          ? parseInt(formData.get("proyecto_id") as string)
          : undefined,
      };

      if (action !== "delete") {
        const errors = validatePropertiesSchema(action, dataToValidate);
        if (Object.keys(errors).length > 0) {
          return { errors, data: dataToValidate };
        }
        if (action === "add") {
          const ubicacionesIds = formData.getAll("ubicacion") as string[];
          if (
            ubicacionesIds.length === 0 ||
            ubicacionesIds.some((id) => id === null || id === "")
          ) {
            return {
              data: dataToValidate,
              errors: {
                ubicacion: "Debes seleccionar al menos una ubicación",
              },
            };
          }
        }
      }

      const id = propiedad?.id ?? 0;
      const created_at = propiedad?.created_at ?? new Date();
      const updated_at = new Date();
      setOptimisticData({
        id,
        created_at,
        updated_at,
        ...dataToValidate,
      } as IPropiedad | null);

      try {
        const res = await fetch(
          `http://localhost:8000/api/propiedad${
            action === "edit" || action === "delete" ? `/${id}` : ""
          }`,
          {
            method:
              action === "delete"
                ? "DELETE"
                : action === "edit"
                ? "PUT"
                : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToValidate),
            credentials: "include",
          }
        );

        if (!res.ok) {
          const apiResponse = await res.json();
          console.error(apiResponse);
          return {
            data: dataToValidate,
            message: `Error ${
              action === "edit"
                ? "updating"
                : action === "delete"
                ? "deleting"
                : "creating"
            } propiedad`,
          };
        }

        if (action === "add") {
          const ubicacionesIds = formData.getAll("ubicacion") as string[];
          const responseData = await res.json();

          const newPropiedad = responseData as IPropiedad;

          const addUbicaciones = await Promise.all(
            ubicacionesIds.map(async (id) => {
              const res = await fetch(
                `http://localhost:8000/api/propiedad/${newPropiedad.id}/ubicacion/${id}`,
                {
                  method: "POST",
                  credentials: "include",
                }
              );
              return res.ok;
            })
          );

          if (addUbicaciones.includes(false)) {
            return {
              data: dataToValidate,
              message: "Error adding ubicaciones",
            };
          }
        }
      } catch (error) {
        console.error(error);
        return {
          data: dataToValidate,
          message: "Error interno",
        };
      } finally {
        router.refresh();
        onClose();
      }
    },
    [action, onClose, propiedad, setOptimisticData, router]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, data, message } = state ?? {};

  const transformedUbicaciones = ubicaciones.map(({ id, nombre, ...rest }) => ({
    key: id.toString(),
    name: nombre,
    ...rest,
  }));

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="disabled:opacity-50 space-y-4">
        {message && (
          <div className="text-center text-white bg-red-500 p-2 rounded">
            {message}
          </div>
        )}
        {action !== "delete" ? (
          <>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="nombre"
                  ariaLabel="Nombre"
                  placeholder="SUN A-1"
                  defaultValue={data?.nombre ?? ""}
                  error={errors?.nombre}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="superficie"
                  ariaLabel="Superficie"
                  placeholder="47.92"
                  defaultValue={data?.superficie?.toString()}
                  error={errors?.superficie}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="valor_comercial"
                  ariaLabel="Valor Comercial"
                  placeholder="1980677.36"
                  defaultValue={data?.valor_comercial?.toString() ?? ""}
                  error={errors?.valor_comercial}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="select"
                  id="proyecto_id"
                  ariaLabel="Proyecto"
                  error={errors?.proyecto_id}
                  placeholder="Selecciona un proyecto..."
                  defaultValue={data?.proyecto_id?.toString() ?? ""}
                  options={proyectos.map((p) => ({
                    value: p.id.toString(),
                    label: p.nombre,
                  }))}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="anio_valor_comercial"
                  ariaLabel="Año Valor Comercial"
                  placeholder="2023"
                  defaultValue={data?.anio_valor_comercial?.toString() ?? ""}
                  error={errors?.anio_valor_comercial}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="clave_catastral"
                  ariaLabel="Clave Catastral"
                  placeholder="360030958001"
                  defaultValue={data?.clave_catastral ?? ""}
                  error={errors?.clave_catastral}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="base_predial"
                  ariaLabel="Base Predial"
                  placeholder="916.0"
                  defaultValue={data?.base_predial?.toString() ?? ""}
                  error={errors?.base_predial}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="adeudo_predial"
                  ariaLabel="Adeudo Predial"
                  placeholder="200.0"
                  defaultValue={data?.adeudo_predial?.toString() ?? ""}
                  error={errors?.adeudo_predial}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="anios_pend_predial"
                  ariaLabel="Años Pend. Predial"
                  placeholder="2"
                  defaultValue={data?.anios_pend_predial?.toString() ?? ""}
                  error={errors?.anios_pend_predial}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="comentarios"
                  ariaLabel="Comentarios"
                  placeholder="Sin comentarios"
                  defaultValue={data?.comentarios ?? ""}
                  error={errors?.comentarios}
                />
              </GenericDiv>
            </GenericPairDiv>
            {action === "add" && (
              <DynamicItemManager
                items={transformedUbicaciones ?? []}
                renderForm={(index, items, onSelect) => (
                  <AutocompleteInput
                    key={index}
                    id="ubicacion"
                    ariaLabel="Ubicación"
                    customClassName="mt-2"
                    error={errors?.ubicacion}
                    placeholder="Busca un ubicación..."
                    additionOnChange={(e) => onSelect(index, e.target.value)}
                    suggestions={items.map((i) => ({
                      value: i.key,
                      label: i.name,
                    }))}
                  />
                )}
              />
            )}
          </>
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar la propiedad{" "}
              <span className="font-bold">{data?.nombre}?</span>
            </p>
          </div>
        )}
        <div className="text-center text-white">
          <SubmitButton
            title={
              action === "add"
                ? "Crear"
                : action === "edit"
                ? "Actualizar"
                : "Eliminar"
            }
            color={
              action === "add" ? "green" : action === "edit" ? "blue" : "red"
            }
            pending={isPending}
          />
        </div>
      </fieldset>
    </form>
  );
};

export default Form;

const GenericPairDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">{children}</div>
  );
};

const GenericDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 w-full sm:w-1/2 justify-end">
      {children}
    </div>
  );
};
