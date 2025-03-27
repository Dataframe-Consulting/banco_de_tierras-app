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
import type { IPropietario } from "@/app/shared/interfaces";

interface IProjectsOwnersForm {
  proyectoId: number;
  action: "add" | "delete";
  propietario: IPropietario | IPropietario[];
  onCloseForm?: () => void;
  refresh: () => void;
}

const ProjectsOwnersForm = ({
  action,
  proyectoId,
  propietario,
  refresh,
}: IProjectsOwnersForm) => {
  const { onOpen, isOpen, onClose } = useModal();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Form
          action={action}
          proyectoId={proyectoId}
          propietario={propietario}
          onCloseForm={onClose}
          refresh={refresh}
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

export default ProjectsOwnersForm;

interface IFormState {
  message?: string;
  errors?: {
    [key: string]: string;
  };
}

const Form = ({
  action,
  proyectoId,
  propietario,
  onCloseForm,
  refresh,
}: IProjectsOwnersForm) => {
  const initialState: IFormState = {
    errors: {},
    message: "",
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      try {
        if (action === "add") {
          const dataIds = formData.getAll("propietario") as string[];
          if (
            dataIds.length === 0 ||
            dataIds.some((id) => id === null || id === "")
          ) {
            return {
              errors: {
                propietario: "Debe seleccionar al menos un propietario",
              },
            };
          }

          const addData = await Promise.all(
            dataIds.map(async (id) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/proyecto/${proyectoId}/propietario/${id}`,
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
            }/proyecto/${proyectoId}/propietario/${
              (propietario as IPropietario).id
            }`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (!deleteResponse.ok) {
            return {
              message: "Error deleting propietario",
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
    [action, refresh, onCloseForm, propietario, proyectoId]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, message } = state ?? {};

  const transformedData = Array.isArray(propietario)
    ? propietario.map(({ id, nombre, ...rest }) => ({
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
                id="propietario"
                ariaLabel="Propietario"
                customClassName="mt-2"
                error={errors?.propietario}
                placeholder="Busca un propietario..."
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
              ¿Estás seguro de que deseas eliminar el propietario{" "}
              <span className="font-bold">
                {(propietario as IPropietario)?.nombre}
              </span>{" "}
              de este proyecto?
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
