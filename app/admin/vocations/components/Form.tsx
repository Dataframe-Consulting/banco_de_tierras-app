"use client";

import { useRouter } from "next/navigation";
import { useCallback, useActionState } from "react";
import validateLegalProcessesSchema from "../schemas";
import {
  AutocompleteInput,
  DynamicItemManager,
  GenericInput,
  SubmitButton,
} from "@/app/shared/components";
import type { IPropiedad, IProcesoLegal } from "@/app/shared/interfaces";

interface IRentaState {
  message?: string;
  data?: {
    abogado?: string;
    tipo_proceso?: string;
    estatus?: string;
    propiedad_id?: number;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  onClose: () => void;
  procesoLegal: IProcesoLegal | null;
  propiedades: IPropiedad[];
  action: "add" | "edit" | "delete";
  setOptimisticData: (data: IProcesoLegal | null) => void;
}

const Form = ({
  procesoLegal,
  action,
  onClose,
  propiedades,
  setOptimisticData,
}: IForm) => {
  const router = useRouter();

  const initialState: IRentaState = {
    errors: {},
    message: "",
    data: procesoLegal,
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        abogado: formData.get("abogado")
          ? (formData.get("abogado") as string)
          : undefined,
        tipo_proceso: formData.get("tipo_proceso")
          ? (formData.get("tipo_proceso") as string)
          : undefined,
        estatus: formData.get("estatus")
          ? (formData.get("estatus") as string)
          : undefined,
        propiedad_id: formData.get("propiedad_id")
          ? parseInt(formData.get("propiedad_id") as string)
          : undefined,
      };

      if (action !== "delete") {
        const errors = validateLegalProcessesSchema(action, dataToValidate);
        if (Object.keys(errors).length > 0) {
          return {
            errors,
            data: dataToValidate,
          };
        }
      }

      const id = procesoLegal?.id ?? 0;
      const created_at = procesoLegal?.created_at ?? new Date();
      const updated_at = new Date();
      setOptimisticData({
        id,
        created_at,
        updated_at,
        ...dataToValidate,
      } as IProcesoLegal | null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/proceso_legal${
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
            } renta`,
          };
        }
      } catch (error) {
        console.error(error);
        return {
          data: dataToValidate,
          message: "Error connecting to the server",
        };
      } finally {
        router.refresh();
        onClose();
      }
    },
    [procesoLegal, router, action, onClose, setOptimisticData]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, data, message } = state ?? {};

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="disabled:opacity-50 space-y-4">
        {message && (
          <div className="text-center text-white bg-red-500 p-2 rounded">
            {message}
          </div>
        )}
        {action !== "delete" ? (
          <div className="flex flex-col gap-2 w-full">
            <GenericInput
              id="nombre"
              type="text"
              ariaLabel="Nombre"
              placeholder="Comercialización"
              defaultValue={data?.nombre}
              error={errors?.nombre}
            />
          </div>
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar el proceso legal con el
              abogado{" "}
              <span className="font-bold">{procesoLegal?.abogado}?</span>
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
