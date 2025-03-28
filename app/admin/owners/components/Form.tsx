"use client";

import { useCallback, useActionState } from "react";
import validateOwnerSchema from "../schemas";
import {
  AutocompleteInput,
  DynamicItemManager,
  GenericInput,
  SubmitButton,
} from "@/app/shared/components";
import type { ISocio, IPropietario } from "@/app/shared/interfaces";

interface IRentaState {
  message?: string;
  data?: {
    nombre?: string;
    rfc?: string;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  onClose: () => void;
  propietario: IPropietario | null;
  socios: ISocio[];
  action: "add" | "edit" | "delete";
  setOptimisticData: (data: IPropietario | null) => void;
  refresh: () => void;
}

const Form = ({
  propietario,
  action,
  onClose,
  socios,
  setOptimisticData,
  refresh,
}: IForm) => {
  const initialState: IRentaState = {
    errors: {},
    message: "",
    data: propietario,
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        nombre: formData.get("nombre")
          ? (formData.get("nombre") as string)
          : undefined,
        rfc: formData.get("rfc") ? (formData.get("rfc") as string) : undefined,
      };

      if (action !== "delete") {
        const errors = validateOwnerSchema(action, dataToValidate);
        if (Object.keys(errors).length > 0) {
          return {
            errors,
            data: dataToValidate,
          };
        }
      }

      const id = propietario?.id ?? 0;
      const created_at = propietario?.created_at ?? new Date();
      const updated_at = new Date();
      setOptimisticData({
        id,
        created_at,
        updated_at,
        ...dataToValidate,
      } as IPropietario | null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/propietario${
            action === "edit" || action === "delete" ? `/${id}` : "/"
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
            } renta`,
          };
        }

        const sociosIds = formData.getAll("socio") as string[];
        if (
          action === "add" &&
          (sociosIds.length !== 0 ||
            sociosIds.some((id) => id !== null || id !== ""))
        ) {
          const responseData = await res.json();

          const newPropietario = responseData as IPropietario;

          const addSocios = await Promise.all(
            sociosIds.map(async (id) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/propietario/${newPropietario.id}/socio/${id}`,
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
          if (addSocios.includes(false)) {
            return {
              data: dataToValidate,
              message: "Error adding data",
            };
          }
        }
      } catch (error) {
        console.error(error);
        return {
          data: dataToValidate,
          message: "Error connecting to the server",
        };
      } finally {
        refresh();
        onClose();
      }
    },
    [propietario, refresh, action, onClose, setOptimisticData]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, data, message } = state ?? {};

  const transformedData = socios.map(({ id, nombre }) => ({
    key: id.toString(),
    name: nombre,
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
                  id="nombre"
                  type="text"
                  placeholder="DME"
                  ariaLabel="Nombre"
                  defaultValue={data?.nombre}
                  error={errors?.nombre}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  id="rfc"
                  type="text"
                  ariaLabel="RFC"
                  placeholder="MAED9909103I0"
                  defaultValue={data?.rfc}
                  error={errors?.rfc}
                />
              </GenericDiv>
            </GenericPairDiv>
            {action === "add" && (
              <DynamicItemManager
                items={transformedData ?? []}
                renderForm={(index, items, onSelect) => (
                  <AutocompleteInput
                    key={index}
                    id="socio"
                    customClassName="mt-2"
                    ariaLabel="Socio"
                    error={errors?.socio}
                    placeholder="Busca un socio..."
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
              ¿Estás seguro de que deseas eliminar al propietario
              <span className="font-bold">{propietario?.nombre}?</span>
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
