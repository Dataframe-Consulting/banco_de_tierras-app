"use client";

import { useAuth } from "@/app/shared/hooks";
import { useActionState, useCallback } from "react";
import validateLoginSchema from "../schemas";
import { GenericInput, SubmitButton } from "@/app/shared/components";

interface ILoginState {
  message?: string;
  errors?: {
    [key: string]: string;
  };
  data?: {
    username?: string;
    password?: string;
  };
}

const Form = () => {
  const { login } = useAuth();

  const initialState: ILoginState = {
    data: {},
    errors: {},
    message: "",
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      };

      const errors = validateLoginSchema("login", dataToValidate);
      if (Object.keys(errors).length > 0) {
        return {
          errors,
          data: dataToValidate,
        };
      }

      const success = await login(
        dataToValidate.username,
        dataToValidate.password
      );

      if (!success) {
        return {
          data: dataToValidate,
          message: "Invalid credentials",
        };
      }

      window.location.href = "/admin/home";
    },
    [login]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, data, message } = state ?? {};

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="disabled:opacity-50 space-y-4">
        {message && <p className="text-center text-red-500">{message}</p>}
        <div>
          <GenericInput
            type="text"
            id="username"
            ariaLabel="Username"
            placeholder="Username"
            error={errors?.username}
            defaultValue={data?.username}
          />
        </div>
        <div>
          <GenericInput
            id="password"
            type="password"
            ariaLabel="Contraseña"
            placeholder="***********"
            error={errors?.password}
            defaultValue={data?.password}
          />
        </div>
        <div className="text-center text-white">
          <SubmitButton title="Login" pending={isPending} />
        </div>
      </fieldset>
    </form>
  );
};

export default Form;
