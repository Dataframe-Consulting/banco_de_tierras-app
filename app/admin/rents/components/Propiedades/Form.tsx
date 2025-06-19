"use client";

import cn from "@/app/shared/utils/cn";
import { useModal } from "@/app/shared/hooks";
import { useActionState, useCallback } from "react";
import { PlusCircle, TrashIcon } from "@/app/shared/icons";
import {
  Modal,
  SubmitButton,
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components";
import type { IPropiedad } from "@/app/shared/interfaces";

interface IRentsPropertiesForm {
  rentaId: number;
  action: "add" | "delete";
  propiedad: IPropiedad | IPropiedad[];
  refresh: () => void;
  onCloseForm?: () => void;
}

const RentsPropertiesForm = ({
  action,
  rentaId,
  propiedad,
  refresh,
}: IRentsPropertiesForm) => {
  const { onOpen, isOpen, onClose } = useModal();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Form
          action={action}
          rentaId={rentaId}
          propiedad={propiedad}
          refresh={refresh}
          onCloseForm={onClose}
        />
      </Modal>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "p-2 text-white rounded-md",
          action === "add" ? "bg-green-400" : "bg-red-400"
        )}
      >
        {action === "add" ? <PlusCircle /> : <TrashIcon />}
      </button>
    </>
  );
};

export default RentsPropertiesForm;

interface IFormState {
  message?: string;
  errors?: {
    [key: string]: string;
  };
}

const Form = ({
  action,
  rentaId,
  propiedad,
  refresh,
  onCloseForm,
}: IRentsPropertiesForm) => {
  const initialState: IFormState = {
    errors: {},
    message: "",
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      try {
        if (action === "add") {
          const propiedadesIds = formData.getAll("propiedad") as string[];
          if (
            propiedadesIds.length === 0 ||
            propiedadesIds.some((id) => id === null || id === "")
          ) {
            return {
              errors: {
                propiedad: "Debe seleccionar al menos una propiedad",
              },
            };
          }

          const addPropiedades = await Promise.all(
            propiedadesIds.map(async (id) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/renta/${rentaId}/propiedad/${id}`,
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
            `${process.env.NEXT_PUBLIC_API_URL}/renta/${rentaId}/propiedad/${
              (propiedad as IPropiedad).id
            }`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (!deleteResponse.ok) {
            return {
              message: "Error deleting propiedad",
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
    [action, propiedad, rentaId, refresh, onCloseForm]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, message } = state ?? {};

  const transformedPropiedades = Array.isArray(propiedad)
    ? propiedad.map(({ id, nombre, ...rest }) => ({
        key: id.toString(),
        name: nombre,
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
            items={transformedPropiedades ?? []}
            renderForm={(index, items, onSelect) => (
              <AutocompleteInput
                key={index}
                id="propiedad"
                ariaLabel="Propiedad"
                customClassName="mt-2"
                error={errors?.propiedad}
                placeholder="Busca un propiedad..."
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
              ¿Estás seguro de que deseas eliminar la propiedad{" "}
              <span className="font-bold">
                {(propiedad as IPropiedad)?.nombre}
              </span>{" "}
              de esta renta?
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
