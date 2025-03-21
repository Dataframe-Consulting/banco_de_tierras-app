"use client";

import { useRouter } from "next/navigation";
import validateSocietiesSchema from "../schemas";
import { useCallback, useActionState } from "react";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import type { ISociedad } from "@/app/shared/interfaces";

interface IFormState {
  message?: string;
  data?: {
    porcentaje_participacion?: number;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  onClose: () => void;
  societie: ISociedad | null;
  action: "add" | "edit" | "delete";
  setOptimisticData: (data: ISociedad | null) => void;
}

const Form = ({ action, societie, onClose, setOptimisticData }: IForm) => {
  const router = useRouter();

  const initialState: IFormState = {
    errors: {},
    message: "",
    data: societie,
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        porcentaje_participacion: formData.get("porcentaje_participacion")
          ? Number(formData.get("porcentaje_participacion"))
          : undefined,
      };

      if (action !== "delete") {
        const errors = validateSocietiesSchema(action, dataToValidate);
        if (Object.keys(errors).length > 0) {
          return {
            errors,
            data: dataToValidate,
          };
        }
      }

      const id = societie?.id ?? 0;
      const created_at = societie?.created_at ?? new Date();
      const updated_at = new Date();
      setOptimisticData({
        id,
        created_at,
        updated_at,
        ...dataToValidate,
      } as ISociedad | null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/sociedad${
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
    [societie, router, action, onClose, setOptimisticData]
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
              type="number"
              id="porcentaje_participacion"
              placeholder="22"
              step="0.01"
              min="0"
              max="100"
              ariaLabel="Porcentaje de participación"
              defaultValue={data?.porcentaje_participacion?.toString()}
              error={errors?.porcentaje_participacion}
            />
          </div>
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar a la sociedad con el valor de
              participación{" "}
              <span className="font-bold">
                {societie?.porcentaje_participacion}?
              </span>
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
