import { useRouter } from "next/navigation";
import { useActionState, useCallback } from "react";
import {
  SubmitButton,
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components";
import type { ISociedad } from "@/app/shared/interfaces";

interface IFormState {
  message?: string;
  errors?: {
    [key: string]: string;
  };
}

interface IPropertiesSocietiesForm {
  propiedadId: number;
  action: "add" | "delete";
  sociedad: ISociedad | ISociedad[];
  onCloseForm?: () => void;
}

const PropertiesSocietiesForm = ({
  action,
  propiedadId,
  sociedad,
  onCloseForm,
}: IPropertiesSocietiesForm) => {
  console.log("action", action);
  console.log("propiedadId", propiedadId);
  console.log("sociedad", sociedad);

  const router = useRouter();

  const initialState: IFormState = {
    errors: {},
    message: "",
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      try {
        if (action === "add") {
          const propiedadesIds = formData.getAll("sociedad") as string[];
          if (
            propiedadesIds.length === 0 ||
            propiedadesIds.some((id) => id === null || id === "")
          ) {
            return {
              errors: {
                sociedad: "Debe seleccionar al menos una sociedad",
              },
            };
          }

          const addPropiedades = await Promise.all(
            propiedadesIds.map(async (id) => {
              const res = await fetch(
                `http://localhost:8000/api/propiedad/${propiedadId}/sociedad/${id}`,
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

          if (addPropiedades.includes(false)) {
            return {
              message: "Error adding propiedades",
            };
          }
        } else {
          const deleteResponse = await fetch(
            `http://localhost:8000/api/propiedad/${propiedadId}/sociedad/${
              (sociedad as ISociedad).id
            }`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (!deleteResponse.ok) {
            return {
              message: "Error deleting sociedad",
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
    [action, router, onCloseForm, sociedad, propiedadId]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, message } = state ?? {};

  const transformedSociedades = Array.isArray(sociedad)
    ? sociedad.map(({ id, porcentaje_participacion, ...rest }) => ({
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
            items={transformedSociedades ?? []}
            renderForm={(index, items, onSelect) => (
              <AutocompleteInput
                key={index}
                id="sociedad"
                ariaLabel="Sociedad"
                customClassName="mt-2"
                error={errors?.sociedad}
                placeholder="Busca una sociedad..."
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
              ¿Estás seguro de que deseas eliminar la sociedad{" "}
              <span className="font-bold">
                {(sociedad as ISociedad)?.porcentaje_participacion}
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

export default PropertiesSocietiesForm;
