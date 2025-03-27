"use client";

import { useRouter } from "next/navigation";
import validatePartnersSchema from "../schemas";
import { useCallback, useActionState } from "react";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import type { ISocio } from "@/app/shared/interfaces";

interface IRentaState {
  message?: string;
  data?: {
    nombre?: string;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  onClose: () => void;
  partner: ISocio | null;
  action: "add" | "edit" | "delete";
  setOptimisticData: (data: ISocio | null) => void;
}

const Form = ({ action, partner, onClose, setOptimisticData }: IForm) => {
  const router = useRouter();

  const initialState: IRentaState = {
    errors: {},
    message: "",
    data: partner,
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        nombre: formData.get("nombre")
          ? (formData.get("nombre") as string)
          : undefined,
      };

      if (action !== "delete") {
        const errors = validatePartnersSchema(action, dataToValidate);
        if (Object.keys(errors).length > 0) {
          return {
            errors,
            data: dataToValidate,
          };
        }
      }

      const id = partner?.id ?? 0;
      const created_at = partner?.created_at ?? new Date();
      const updated_at = new Date();
      setOptimisticData({
        id,
        created_at,
        updated_at,
        ...dataToValidate,
      } as ISocio | null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/socio${
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
        router.refresh();
        onClose();
      }
    },
    [partner, router, action, onClose, setOptimisticData]
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
              id="nombre"
              placeholder="Real MC"
              ariaLabel="Nombre"
              defaultValue={data?.nombre}
              error={errors?.nombre}
            />
          </div>
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar al socio{" "}
              <span className="font-bold">{partner?.nombre}?</span>
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
