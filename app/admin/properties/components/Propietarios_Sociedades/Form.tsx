"use client";

import { useActionState, useCallback } from "react";
import {
  SubmitButton,
  AutocompleteInput,
  DynamicItemManager,
  GenericInput,
} from "@/app/shared/components";
import type {
  ISociedad,
  IPropietario,
  IPropietarioSociedad,
} from "@/app/shared/interfaces";

interface IFormState {
  message?: string;
  errors?: {
    [key: string]: string;
  };
}

interface IPropiedadPropietarioSociedadForm {
  action: "add" | "delete";
  propietario_sociedad?: IPropietarioSociedad;
  propiedadId?: number;
  propietarios?: IPropietario[];
  sociedades?: ISociedad[];
  onCloseForm?: () => void;
  refresh: () => void;
}

const PropiedadPropietarioSociedadForm = ({
  action,
  propietario_sociedad,
  propiedadId,
  propietarios,
  sociedades,
  onCloseForm,
  refresh,
}: IPropiedadPropietarioSociedadForm) => {
  const initialState: IFormState = {
    errors: {},
    message: "",
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      try {
        if (action === "add" && propiedadId) {
          const propietariosIds = formData.getAll(
            "propietario_socio"
          ) as string[];
          if (
            propietariosIds.length === 0 ||
            propietariosIds.some((id) => id === null || id === "")
          ) {
            return {
              errors: {
                propietario_socio:
                  "Debes seleccionar al menos un propietario/socio ",
              },
            };
          }
          const esSociosValues: boolean[] = propietariosIds.map((_, index) => {
            const checkbox = formData.get(`propietario_${index}_es_socio`);
            return checkbox === "on" ? true : false;
          });
          const sociedadesIds = formData.getAll("sociedad") as string[];
          if (
            sociedadesIds.length === 0 ||
            sociedadesIds.some((id) => id === null || id === "")
          ) {
            return {
              errors: {
                sociedad: "Debes seleccionar al menos una sociedad",
              },
            };
          }
          if (propietariosIds.length !== sociedadesIds.length) {
            return {
              errors: {
                propietario_socio:
                  "El número de propietarios/socios y sociedades no coincide",
                sociedad:
                  "El número de propietarios/socios y sociedades no coincide",
              },
            };
          }

          const addPropietarioSociedad = await Promise.all(
            propietariosIds.map(async (id, index) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/propiedad/${propiedadId}/propietario/${id}/sociedad/${sociedadesIds[index]}/es_socio/${esSociosValues[index]}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              );
              return res.ok;
            })
          );

          if (addPropietarioSociedad.includes(false)) {
            return {
              message: "Error adding register",
            };
          }
        } else {
          const deleteResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/propiedad/${propietario_sociedad?.propiedad_id}/propietario/${propietario_sociedad?.propietario_id}/sociedad/${propietario_sociedad?.sociedad_id}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (!deleteResponse.ok) {
            return {
              message: "Error deleting register",
            };
          }
        }
      } catch (error) {
        console.error(error);
        return {
          message: "Error connecting to the server",
        };
      } finally {
        refresh();
        onCloseForm?.();
      }
    },
    [action, refresh, onCloseForm, propietario_sociedad, propiedadId]
  );

  // @ts-expect-error: useActionState returns a tuple that TypeScript cannot infer correctly
  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, message } = state ?? {};

  const transformedPropietarios = Array.isArray(propietarios)
    ? propietarios.map(({ id, nombre }) => ({
        key: id.toString(),
        name: nombre,
      }))
    : [];

  const transformedSociedades = Array.isArray(sociedades)
    ? sociedades.map(({ id, porcentaje_participacion, ...rest }) => ({
        key: id.toString(),
        name: porcentaje_participacion.toString(),
        ...rest,
      }))
    : [];

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="disabled:opacity-50 space-y-4">
        {message && (
          <div className="text-center text-white bg-red-500 p-2 rounded">
            {message}
          </div>
        )}
        {action === "add" ? (
          <DynamicItemManager
            items={transformedPropietarios ?? []}
            renderForm={(index, items, onSelect) => (
              <div key={index} className="flex flex-col md:flex-row gap-2">
                <div className="w-full md:w-2/3">
                  <AutocompleteInput
                    id="propietario_socio"
                    ariaLabel="Propietario/Socio"
                    customClassName="mt-2"
                    error={errors?.propietario_socio}
                    placeholder="Busca un propietario/socio..."
                    additionOnChange={(e) => onSelect(index, e.target.value)}
                    suggestions={items.map((i) => ({
                      value: i.key,
                      label: i.name,
                    }))}
                  />
                  <GenericInput
                    id={`propietario_${index}_es_socio`}
                    type="checkbox"
                    ariaLabel="¿Es socio?"
                    labelClassName="mr-2"
                  />
                </div>
                <div className=" w-full md:w-1/3">
                  <AutocompleteInput
                    id="sociedad"
                    ariaLabel="Sociedad"
                    customClassName="mt-2"
                    error={errors?.sociedad}
                    placeholder="Busca un porcentaje..."
                    additionOnChange={(e) => onSelect(index, e.target.value)}
                    suggestions={transformedSociedades.map((i) => ({
                      value: i.key,
                      label: i.name,
                    }))}
                  />
                </div>
              </div>
            )}
          />
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar al propietario{" "}
              <span className="font-bold">
                {propietario_sociedad?.propietario.nombre}
              </span>{" "}
              de esta propiedad?
            </p>
          </div>
        )}
        <div className="text-center text-white">
          <SubmitButton
            title={action === "add" ? "Crear" : "Eliminar"}
            color={action === "add" ? "green" : "red"}
            pending={isPending}
          />
        </div>
      </fieldset>
    </form>
  );
};

export default PropiedadPropietarioSociedadForm;
