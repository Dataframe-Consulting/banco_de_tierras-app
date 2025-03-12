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
import type { IUbicacion } from "@/app/shared/interfaces";

interface IPropertiesLocationsForm {
  propiedadId: number;
  action: "add" | "delete";
  ubicacion: IUbicacion | IUbicacion[];
  onCloseForm?: () => void;
}

const PropertiesLocationsForm = ({
  action,
  ubicacion,
  propiedadId,
}: IPropertiesLocationsForm) => {
  const { onOpen, isOpen, onClose } = useModal();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Form
          action={action}
          propiedadId={propiedadId}
          ubicacion={ubicacion}
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

export default PropertiesLocationsForm;

interface IFormState {
  message?: string;
  errors?: {
    [key: string]: string;
  };
}

const Form = ({
  action,
  propiedadId,
  ubicacion,
  onCloseForm,
}: IPropertiesLocationsForm) => {
  const router = useRouter();

  const initialState: IFormState = {
    errors: {},
    message: "",
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      try {
        if (action === "add") {
          const propiedadesIds = formData.getAll("ubicacion") as string[];
          if (
            propiedadesIds.length === 0 ||
            propiedadesIds.some((id) => id === null || id === "")
          ) {
            return {
              errors: {
                ubicacion: "Debe seleccionar al menos una ubicación",
              },
            };
          }

          const addPropiedades = await Promise.all(
            propiedadesIds.map(async (id) => {
              const res = await fetch(
                `http://localhost:8000/api/propiedad/${propiedadId}/ubicacion/${id}`,
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
            `http://localhost:8000/api/propiedad/${propiedadId}/ubicacion/${
              (ubicacion as IUbicacion).id
            }`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (!deleteResponse.ok) {
            return {
              message: "Error deleting ubicacion",
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
    [action, router, onCloseForm, ubicacion, propiedadId]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, message } = state ?? {};

  const transformedUbicaciones = Array.isArray(ubicacion)
    ? ubicacion.map(({ id, nombre, ...rest }) => ({
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
            items={transformedUbicaciones ?? []}
            renderForm={(index, items, onSelect) => (
              <AutocompleteInput
                key={index}
                id="ubicacion"
                ariaLabel="Ubicación"
                customClassName="mt-2"
                error={errors?.ubicacion}
                placeholder="Busca una ubicación..."
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
              ¿Estás seguro de que deseas eliminar la ubicacion{" "}
              <span className="font-bold">
                {(ubicacion as IUbicacion)?.nombre}
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
