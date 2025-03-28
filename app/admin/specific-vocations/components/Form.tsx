"use client";

import { useCallback, useActionState } from "react";
import validateSpecificVocationsSchema from "../schemas";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import type { IVocacionEspecifica } from "@/app/shared/interfaces";

interface IRentaState {
  message?: string;
  data?: {
    valor?: string;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  onClose: () => void;
  specificVocation: IVocacionEspecifica | null;
  action: "add" | "edit" | "delete";
  setOptimisticData: (data: IVocacionEspecifica | null) => void;
  refresh: () => void;
}

const Form = ({
  action,
  specificVocation,
  onClose,
  setOptimisticData,
  refresh,
}: IForm) => {
  const initialState: IRentaState = {
    errors: {},
    message: "",
    data: specificVocation,
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        valor: formData.get("valor")
          ? (formData.get("valor") as string)
          : undefined,
      };

      if (action !== "delete") {
        const errors = validateSpecificVocationsSchema(action, dataToValidate);
        if (Object.keys(errors).length > 0) {
          return {
            errors,
            data: dataToValidate,
          };
        }
      }

      const id = specificVocation?.id ?? 0;
      const created_at = specificVocation?.created_at ?? new Date();
      const updated_at = new Date();
      setOptimisticData({
        id,
        created_at,
        updated_at,
        ...dataToValidate,
      } as IVocacionEspecifica | null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vocacion_especifica${
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
    [specificVocation, refresh, action, onClose, setOptimisticData]
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
          <div className="flex flex-col gap-2">
            <GenericInput
              type="text"
              id="valor"
              placeholder="Aportación"
              ariaLabel="Valor"
              defaultValue={data?.valor}
              error={errors?.valor}
            />
          </div>
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar la vocación especifica{" "}
              <span className="font-bold">{specificVocation?.valor}?</span>
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
