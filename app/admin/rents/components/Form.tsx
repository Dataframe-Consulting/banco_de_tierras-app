"use client";

import validateRentsSchema from "../schemas";
// import { useRouter } from "next/navigation";
import formatdateInput from "@/app/shared/utils/formatdate-input";
import {
  useCallback,
  // useState,
  useActionState,
  // startTransition,
} from "react";
import {
  GenericInput,
  SubmitButton,
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components";
import type { IPropiedad, IRenta } from "@/app/shared/interfaces";

interface IRentaState {
  message?: string;
  data?: {
    nombre_comercial: string;
    razon_social: string;
    renta_sin_iva: number;
    deposito_garantia_concepto?: string;
    deposito_garantia_monto?: number;
    meses_gracia_concepto?: string;
    meses_gracia_fecha_inicio?: Date;
    meses_gracia_fecha_fin?: Date;
    renta_anticipada_concepto?: string;
    renta_anticipada_fecha_inicio?: Date;
    renta_anticipada_fecha_fin?: Date;
    renta_anticipada_renta_sin_iva?: number;
    incremento_mes: string;
    incremento_nota?: string;
    inicio_vigencia: Date;
    fin_vigencia_forzosa: Date;
    fin_vigencia_no_forzosa?: Date;
    vigencia_nota?: string;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  onClose: () => void;
  renta: IRenta | null;
  propiedades: IPropiedad[];
  action: "add" | "edit" | "delete";
  setOptimisticData: (data: IRenta | null) => void;
}

const Form = ({
  renta,
  action,
  // onClose,
  propiedades,
}: // setOptimisticData,
IForm) => {
  // const router = useRouter();
  // const [isPending, setIsPending] = useState(false);
  // const [badResponse, setBadResponse] = useState();

  // const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
  //   event
  // ) => {
  //   setIsPending(true);
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const body = Object.fromEntries(formData.entries());

  //   const parsedBody = {
  //     ...body,
  //     renta_sin_iva: body.renta_sin_iva
  //       ? parseFloat(body.renta_sin_iva as string)
  //       : null,
  //     deposito_garantia_monto: body.deposito_garantia_monto
  //       ? parseFloat(body.deposito_garantia_monto as string)
  //       : null,
  //     renta_anticipada_renta_sin_iva: body.renta_anticipada_renta_sin_iva
  //       ? parseFloat(body.renta_anticipada_renta_sin_iva as string)
  //       : null,
  //   };

  //   // startTransition(() => {
  //   //   setOptimisticData({
  //   //     id: 0,
  //   //     ...parsedBody,
  //   //   } as IRenta);
  //   // });

  //   try {
  //     const res = await fetch(
  //       `http://localhost:8000/api/renta${
  //         action === "edit" || action === "delete" ? `/${renta?.id}` : ""
  //       }`,
  //       {
  //         method:
  //           action === "delete" ? "DELETE" : action === "edit" ? "PUT" : "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(parsedBody),
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error(
  //         `Error ${
  //           action === "edit"
  //             ? "updating"
  //             : action === "delete"
  //             ? "deleting"
  //             : "creating"
  //         } renta`
  //       );
  //     }

  //     if (action === "add") {
  //       const propiedadesIds = formData.getAll("propiedad") as string[];
  //       const responseData = await res.json();
  //       console.log(responseData);

  //       const newRenta = responseData as IRenta;

  //       const addPropiedades = await Promise.all(
  //         propiedadesIds.map(async (id) => {
  //           const res = await fetch(
  //             `http://localhost:8000/api/renta/${newRenta.id}/propiedad/${id}`,
  //             {
  //               method: "POST",
  //             }
  //           );
  //           return res.ok;
  //         })
  //       );

  //       if (addPropiedades.includes(false)) {
  //         throw new Error("Error adding propiedades");
  //       }

  //       console.log("Success adding propiedades");
  //     }

  //     router.refresh();
  //     onClose();
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsPending(false);
  //   }
  // };

  const initialState: IRentaState = {
    message: "",
    data: renta,
    errors: {},
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      // const body = Object.fromEntries(formData.entries());

      const dataToValidate = {
        nombre_comercial: formData.get("nombre_comercial") as string,
        razon_social: formData.get("razon_social") as string,
        renta_sin_iva: formData.get("renta_sin_iva")
          ? Number(formData.get("renta_sin_iva"))
          : 0,
        deposito_garantia_concepto: formData.get("deposito_garantia_concepto")
          ? (formData.get("deposito_garantia_concepto") as string)
          : undefined,
        deposito_garantia_monto: formData.get("deposito_garantia_monto")
          ? Number(formData.get("deposito_garantia_monto"))
          : undefined,
        meses_gracia_concepto: formData.get("meses_gracia_concepto") as string,
        meses_gracia_fecha_inicio: formData.get("meses_gracia_fecha_inicio")
          ? new Date(formData.get("meses_gracia_fecha_inicio") as string)
          : undefined,
        meses_gracia_fecha_fin: formData.get("meses_gracia_fecha_fin")
          ? new Date(formData.get("meses_gracia_fecha_fin") as string)
          : undefined,
        renta_anticipada_concepto: formData.get(
          "renta_anticipada_concepto"
        ) as string,
        renta_anticipada_fecha_inicio: formData.get(
          "renta_anticipada_fecha_inicio"
        )
          ? new Date(formData.get("renta_anticipada_fecha_inicio") as string)
          : undefined,
        renta_anticipada_fecha_fin: formData.get("renta_anticipada_fecha_fin")
          ? new Date(formData.get("renta_anticipada_fecha_fin") as string)
          : undefined,
        renta_anticipada_renta_sin_iva: formData.get(
          "renta_anticipada_renta_sin_iva"
        )
          ? Number(formData.get("renta_anticipada_renta_sin_iva"))
          : undefined,
        incremento_mes: formData.get("incremento_mes") as string,
        incremento_nota: formData.get("incremento_nota") as string,
        inicio_vigencia: new Date(formData.get("inicio_vigencia") as string),
        fin_vigencia_forzosa: new Date(
          formData.get("fin_vigencia_forzosa") as string
        ),
        fin_vigencia_no_forzosa: formData.get("fin_vigencia_no_forzosa")
          ? new Date(formData.get("fin_vigencia_no_forzosa") as string)
          : undefined,
        vigencia_nota: formData.get("vigencia_nota") as string,
      };

      const errors = validateRentsSchema(action, dataToValidate);
      if (Object.keys(errors).length > 0) {
        return {
          errors,
          data: dataToValidate,
        };
      }

      return {
        data: dataToValidate,
        message: "Success",
      };

      // const parsedBody = {
      //   ...body,
      //   renta_sin_iva: body.renta_sin_iva
      //     ? parseFloat(body.renta_sin_iva as string)
      //     : null,
      //   deposito_garantia_monto: body.deposito_garantia_monto
      //     ? parseFloat(body.deposito_garantia_monto as string)
      //     : null,
      //   renta_anticipada_renta_sin_iva: body.renta_anticipada_renta_sin_iva
      //     ? parseFloat(body.renta_anticipada_renta_sin_iva as string)
      //     : null,
      // };

      // const id = renta?.id ?? 0;
      // const optimisticItem: IRenta = {
      //   id,
      //   nombre_comercial: body.nombre_comercial as string,
      //   razon_social: body.razon_social as string,
      //   renta_sin_iva: parsedBody.renta_sin_iva as number,
      //   deposito_garantia_concepto: body.deposito_garantia_concepto as string,
      //   deposito_garantia_monto: parsedBody.deposito_garantia_monto as number,
      //   meses_gracia_concepto: body.meses_gracia_concepto as string,
      //   meses_gracia_fecha_inicio: body.meses_gracia_fecha_inicio
      //     ? new Date(body.meses_gracia_fecha_inicio as string)
      //     : undefined,
      //   meses_gracia_fecha_fin: body.meses_gracia_fecha_fin
      //     ? new Date(body.meses_gracia_fecha_fin as string)
      //     : undefined,
      //   renta_anticipada_concepto: body.renta_anticipada_concepto as string,
      //   renta_anticipada_fecha_inicio: body.renta_anticipada_fecha_inicio
      //     ? new Date(body.renta_anticipada_fecha_inicio as string)
      //     : undefined,
      //   renta_anticipada_fecha_fin: body.renta_anticipada_fecha_fin
      //     ? new Date(body.renta_anticipada_fecha_fin as string)
      //     : undefined,
      //   renta_anticipada_renta_sin_iva:
      //     parsedBody.renta_anticipada_renta_sin_iva as number,
      //   incremento_mes: body.incremento_mes as string,
      //   incremento_nota: body.incremento_nota as string,
      //   inicio_vigencia: new Date(body.inicio_vigencia as string),
      //   fin_vigencia_forzosa: new Date(body.fin_vigencia_forzosa as string),
      //   fin_vigencia_no_forzosa: body.fin_vigencia_no_forzosa
      //     ? new Date(body.fin_vigencia_no_forzosa as string)
      //     : undefined,
      //   vigencia_nota: body.vigencia_nota as string,
      //   propiedades: propiedades,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // };

      // setOptimisticData(optimisticItem);

      // const res = await fetch(
      //   `http://localhost:8000/api/renta${
      //     action === "edit" || action === "delete" ? `/${id}` : ""
      //   }`,
      //   {
      //     method:
      //       action === "delete" ? "DELETE" : action === "edit" ? "PUT" : "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(parsedBody),
      //   }
      // );

      // const res = await fetch("http://localhost:8000/api/renta", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // console.log(await res.json());

      // // const res = {
      // //   ok: false,
      // // };

      // // await new Promise((resolve) => setTimeout(resolve, 5000));

      // if (!res.ok) {
      //   // return {
      //   //   error: `Error ${
      //   //     action === "edit"
      //   //       ? "updating"
      //   //       : action === "delete"
      //   //       ? "deleting"
      //   //       : "creating"
      //   //   } renta`,
      //   // };
      //   const apiResponse = await res.json();
      //   // return extractErrors<IRentaState>(apiResponse);
      // }
    },
    [
      action,
      // propiedades,
      // renta,
      // setOptimisticData
    ]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, data, message } = state ?? {};

  console.log("errors", errors);
  console.log("data", data);
  console.log("message", message);

  const transformedPropiedades = propiedades.map(({ id, nombre, ...rest }) => ({
    key: id.toString(),
    name: nombre,
    ...rest,
  }));

  return (
    // <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <form action={handleSubmit} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="disabled:opacity-50 space-y-4">
        {action !== "delete" ? (
          <>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="nombre_comercial"
                  ariaLabel="Nombre Comercial"
                  placeholder="MOVISTAR"
                  defaultValue={data?.nombre_comercial}
                  error={errors?.nombre_comercial}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="razon_social"
                  ariaLabel="Razón Social"
                  placeholder="Pegaso PCS"
                  defaultValue={data?.razon_social}
                  error={errors?.razon_social}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="renta_sin_iva"
                  ariaLabel="Renta sin IVA"
                  placeholder="1000"
                  defaultValue={data?.renta_sin_iva.toString()}
                  error={errors?.renta_sin_iva}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="deposito_garantia_concepto"
                  ariaLabel="Depósito Garantía Concepto"
                  placeholder="Depósito"
                  defaultValue={data?.deposito_garantia_concepto}
                  error={errors?.deposito_garantia_concepto}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="deposito_garantia_monto"
                  ariaLabel="Depósito Garantía Monto"
                  placeholder="1000"
                  defaultValue={data?.deposito_garantia_monto?.toString()}
                  error={errors?.deposito_garantia_monto}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="meses_gracia_concepto"
                  ariaLabel="Meses Gracia Concepto"
                  placeholder="Meses de gracia"
                  defaultValue={data?.meses_gracia_concepto}
                  error={errors?.meses_gracia_concepto}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="date"
                  id="meses_gracia_fecha_inicio"
                  ariaLabel="Meses Gracia Inicio"
                  placeholder="2025-02-02"
                  defaultValue={
                    data?.meses_gracia_fecha_inicio
                      ? formatdateInput(
                          data.meses_gracia_fecha_inicio.toString()
                        )
                      : ""
                  }
                  error={errors?.meses_gracia_fecha_inicio}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="date"
                  id="meses_gracia_fecha_fin"
                  ariaLabel="Meses Gracia Fin"
                  placeholder="2025-02-02"
                  defaultValue={
                    data?.meses_gracia_fecha_fin
                      ? formatdateInput(data.meses_gracia_fecha_fin.toString())
                      : ""
                  }
                  error={errors?.meses_gracia_fecha_fin}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="renta_anticipada_concepto"
                  ariaLabel="Renta Anticipada Concepto"
                  placeholder="Renta anticipada"
                  defaultValue={data?.renta_anticipada_concepto}
                  error={errors?.renta_anticipada_concepto}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="date"
                  id="renta_anticipada_fecha_inicio"
                  ariaLabel="Renta Anticipada Inicio"
                  placeholder="2025-02-02"
                  defaultValue={
                    data?.renta_anticipada_fecha_inicio
                      ? formatdateInput(
                          data.renta_anticipada_fecha_inicio.toString()
                        )
                      : ""
                  }
                  error={errors?.renta_anticipada_fecha_inicio}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="date"
                  id="renta_anticipada_fecha_fin"
                  ariaLabel="Renta Anticipada Fin"
                  placeholder="2025-02-02"
                  defaultValue={
                    data?.renta_anticipada_fecha_fin
                      ? formatdateInput(
                          data.renta_anticipada_fecha_fin.toString()
                        )
                      : ""
                  }
                  error={errors?.renta_anticipada_fecha_fin}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="renta_anticipada_renta_sin_iva"
                  ariaLabel="Renta Anticipada sin IVA"
                  placeholder="1000"
                  defaultValue={data?.renta_anticipada_renta_sin_iva?.toString()}
                  error={errors?.renta_anticipada_renta_sin_iva}
                />
              </GenericDiv>
            </GenericPairDiv>
            {/* <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="incremento_mes"
                  ariaLabel="Incremento Mes"
                  placeholder="Incremento"
                  defaultValue={data?.incremento_mes}
                  error={errors?.incremento_mes}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="incremento_nota"
                  ariaLabel="Incremento Nota"
                  placeholder="Incremento"
                  defaultValue={data?.incremento_nota}
                  error={errors?.incremento_nota}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="date"
                  id="inicio_vigencia"
                  ariaLabel="Inicio Vigencia"
                  placeholder="2025-02-02"
                  defaultValue={
                    data?.inicio_vigencia
                      ? formatdateInput(data.inicio_vigencia.toString())
                      : ""
                  }
                  error={errors?.inicio_vigencia}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="date"
                  id="fin_vigencia_forzosa"
                  ariaLabel="Fin Vigencia Forzosa"
                  placeholder="2025-02-02"
                  defaultValue={
                    data?.fin_vigencia_forzosa
                      ? formatdateInput(data.fin_vigencia_forzosa.toString())
                      : ""
                  }
                  error={errors?.fin_vigencia_forzosa}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="date"
                  id="fin_vigencia_no_forzosa"
                  ariaLabel="Fin Vigencia No Forzosa"
                  placeholder="2025-02-02"
                  defaultValue={
                    data?.fin_vigencia_no_forzosa
                      ? formatdateInput(data.fin_vigencia_forzosa.toString())
                      : ""
                  }
                  error={errors?.fin_vigencia_no_forzosa}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="vigencia_nota"
                  ariaLabel="Vigencia Nota"
                  placeholder="Vigencia"
                  defaultValue={data?.vigencia_nota}
                  error={errors?.vigencia_nota}
                />
              </GenericDiv>
            </GenericPairDiv> */}
            {action === "add" && (
              <DynamicItemManager
                items={transformedPropiedades ?? []}
                renderForm={(index, items, onSelect) => (
                  <AutocompleteInput
                    key={index}
                    id="propiedad"
                    ariaLabel="Propiedad"
                    customClassName="mt-2"
                    placeholder="Busca un propiedad..."
                    additionOnChange={(e) => onSelect(index, e.target.value)}
                    suggestions={items.map((i) => ({
                      value: i.key,
                      label: i.name,
                    }))}
                  />
                )}
              />
            )}
          </>
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar la renta{" "}
              <span className="font-bold">{renta?.nombre_comercial}?</span>
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
