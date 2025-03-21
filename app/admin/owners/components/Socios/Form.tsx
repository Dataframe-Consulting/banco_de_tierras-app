"use client";

import cn from "@/app/shared/utils/cn";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/shared/hooks";
import { useActionState, useCallback } from "react";
import { PlusCircle, TrashIcon } from "@/app/shared/icons";
import {
  Modal,
  SubmitButton,
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components";
import type { ISocio } from "@/app/shared/interfaces";

interface IOwnersPartnersForm {
  propietarioId: number;
  action: "add" | "delete";
  socio: ISocio | ISocio[];
  onCloseForm?: () => void;
}

const OwnersPartnersForm = ({
  action,
  propietarioId,
  socio,
}: IOwnersPartnersForm) => {
  const { onOpen, isOpen, onClose } = useModal();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Form
          action={action}
          propietarioId={propietarioId}
          socio={socio}
          onCloseForm={onClose}
        />
      </Modal>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "px-4 py-2 text-white rounded-md",
          action === "add" ? "bg-green-400" : "bg-red-400"
        )}
      >
        {action === "add" ? <PlusCircle /> : <TrashIcon />}
      </button>
    </>
  );
};

export default OwnersPartnersForm;

interface IFormState {
  message?: string;
  errors?: {
    [key: string]: string;
  };
}

const Form = ({
  action,
  propietarioId,
  socio,
  onCloseForm,
}: IOwnersPartnersForm) => {
  const router = useRouter();

  const initialState: IFormState = {
    errors: {},
    message: "",
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      try {
        if (action === "add") {
          const dataIds = formData.getAll("socio") as string[];
          if (
            dataIds.length === 0 ||
            dataIds.some((id) => id === null || id === "")
          ) {
            return {
              errors: {
                socio: "Debe seleccionar al menos un socio",
              },
            };
          }

          const addData = await Promise.all(
            dataIds.map(async (id) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/propietario/${propietarioId}/socio/${id}`,
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
            }/propietario/${propietarioId}/socio/${(socio as ISocio).id}`,
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
    [action, router, onCloseForm, socio, propietarioId]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, message } = state ?? {};

  const transformedData = Array.isArray(socio)
    ? socio.map(({ id, nombre, ...rest }) => ({
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
            items={transformedData ?? []}
            renderForm={(index, items, onSelect) => (
              <AutocompleteInput
                key={index}
                id="socio"
                ariaLabel="Socio"
                customClassName="mt-2"
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
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar el socio{" "}
              <span className="font-bold">{(socio as ISocio)?.nombre}</span> de
              este proyecto?
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
