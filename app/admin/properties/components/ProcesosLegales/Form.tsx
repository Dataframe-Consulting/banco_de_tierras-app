"use client";

import { useRouter } from "next/navigation";
import { useActionState, useCallback } from "react";
import {
  SubmitButton,
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components";
import type { IProcesoLegal } from "@/app/shared/interfaces";

interface IFormState {
  message?: string;
  errors?: {
    [key: string]: string;
  };
}

interface IPropertiesLegalProcessesForm {
  propiedadId: number;
  action: "add" | "delete";
  procesoLegal: IProcesoLegal | IProcesoLegal[];
  onCloseForm?: () => void;
}

const PropertiesLegalProcessesForm = ({
  action,
  propiedadId,
  procesoLegal,
  onCloseForm,
}: IPropertiesLegalProcessesForm) => {
  const router = useRouter();

  const initialState: IFormState = {
    errors: {},
    message: "",
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      try {
        if (action === "add") {
          const dataIds = formData.getAll("proceso_legal") as string[];
          if (
            dataIds.length === 0 ||
            dataIds.some((id) => id === null || id === "")
          ) {
            return {
              errors: {
                proceso_legal: "Debe seleccionar al menos un proceso legal",
              },
            };
          }

          const addData = await Promise.all(
            dataIds.map(async (id) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/propiedad/${propiedadId}/proceso_legal/${id}`,
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

          if (addData.includes(false)) {
            return {
              message: "Error adding data",
            };
          }
        } else {
          const deleteResponse = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }/propiedad/${propiedadId}/proceso_legal/${
              (procesoLegal as IProcesoLegal).id
            }`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (!deleteResponse.ok) {
            return {
              message: "Error deleting data",
            };
          }
        }
      } catch (error) {
        console.error(error);
        return {
          message: "Error connecting to the server",
        };
      } finally {
        router.refresh();
        onCloseForm?.();
      }
    },
    [action, router, onCloseForm, procesoLegal, propiedadId]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, message } = state ?? {};

  const transformedData = Array.isArray(procesoLegal)
    ? procesoLegal.map(({ id, abogado, ...rest }) => ({
        key: id.toString(),
        name: abogado,
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
            items={transformedData ?? []}
            renderForm={(index, items, onSelect) => (
              <AutocompleteInput
                key={index}
                id="proceso_legal"
                ariaLabel="Proceso Legal"
                customClassName="mt-2"
                error={errors?.proceso_legal}
                placeholder="Busca un Proceso Legal..."
                additionOnChange={(e) => onSelect(index, e.target.value)}
                suggestions={items.map((i) => ({
                  value: i.key,
                  label: i.name,
                }))}
              />
            )}
          />
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar el proceso legal{" "}
              <span className="font-bold">
                {(procesoLegal as IProcesoLegal)?.abogado}
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

export default PropertiesLegalProcessesForm;
