"use client";

import validateRentsSchema from "../schemas";
import { useCallback, useActionState, useState } from "react";
import formatdateInput from "@/app/shared/utils/formatdate-input";
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
    nombre_comercial?: string;
    razon_social?: string;
    renta_sin_iva?: number;
    meses_deposito_garantia?: number;
    meses_gracia?: number;
    meses_gracia_fecha_inicio?: Date;
    meses_gracia_fecha_fin?: Date;
    meses_renta_anticipada?: number;
    renta_anticipada_fecha_inicio?: Date;
    renta_anticipada_fecha_fin?: Date;
    incremento_mes?: string;
    incremento_nota?: string;
    inicio_vigencia?: Date;
    fin_vigencia_forzosa?: Date;
    fin_vigencia_no_forzosa?: Date;
    vigencia_nota?: string;
    metros_cuadrados_rentados?: number;
    esta_disponible: boolean;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  renta: IRenta | null;
  propiedades: IPropiedad[];
  action: "add" | "edit" | "delete";
  onClose: () => void;
  refresh: () => void;
  setOptimisticData: (data: IRenta | null) => void;
}

const Form = ({
  renta,
  action,
  propiedades,
  onClose,
  refresh,
  setOptimisticData,
}: IForm) => {
  const [disponible, setDisponible] = useState(false);

  const initialState: IRentaState = {
    errors: {},
    message: "",
    data: renta,
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        nombre_comercial: formData.get("nombre_comercial")
          ? (formData.get("nombre_comercial") as string)
          : undefined,
        razon_social: formData.get("razon_social")
          ? (formData.get("razon_social") as string)
          : undefined,
        renta_sin_iva: formData.get("renta_sin_iva")
          ? Number(formData.get("renta_sin_iva"))
          : undefined,
        meses_deposito_garantia: formData.get("meses_deposito_garantia")
          ? Number(formData.get("meses_deposito_garantia") as string)
          : undefined,
        meses_gracia: formData.get("meses_gracia")
          ? Number(formData.get("meses_gracia"))
          : undefined,
        meses_gracia_fecha_inicio: formData.get("meses_gracia_fecha_inicio")
          ? new Date(formData.get("meses_gracia_fecha_inicio") as string)
          : undefined,
        meses_gracia_fecha_fin: formData.get("meses_gracia_fecha_fin")
          ? new Date(formData.get("meses_gracia_fecha_fin") as string)
          : undefined,
        meses_renta_anticipada: formData.get("meses_renta_anticipada")
          ? Number(formData.get("meses_renta_anticipada") as string)
          : undefined,
        renta_anticipada_fecha_inicio: formData.get(
          "renta_anticipada_fecha_inicio"
        )
          ? new Date(formData.get("renta_anticipada_fecha_inicio") as string)
          : undefined,
        renta_anticipada_fecha_fin: formData.get("renta_anticipada_fecha_fin")
          ? new Date(formData.get("renta_anticipada_fecha_fin") as string)
          : undefined,
        incremento_mes: formData.get("incremento_mes")
          ? (formData.get("incremento_mes") as string)
          : undefined,
        incremento_nota: formData.get("incremento_nota")
          ? (formData.get("incremento_nota") as string)
          : undefined,
        inicio_vigencia: formData.get("inicio_vigencia")
          ? new Date(formData.get("inicio_vigencia") as string)
          : undefined,
        fin_vigencia_forzosa: formData.get("fin_vigencia_forzosa")
          ? new Date(formData.get("fin_vigencia_forzosa") as string)
          : undefined,
        fin_vigencia_no_forzosa: formData.get("fin_vigencia_no_forzosa")
          ? new Date(formData.get("fin_vigencia_no_forzosa") as string)
          : undefined,
        vigencia_nota: formData.get("vigencia_nota")
          ? (formData.get("vigencia_nota") as string)
          : undefined,
        metros_cuadrados_rentados: formData.get("metros_cuadrados_rentados")
          ? Number(formData.get("metros_cuadrados_rentados"))
          : undefined,
        esta_disponible: formData.get("esta_disponible") === "on",
      };

      if (action !== "delete") {
        const errors = validateRentsSchema(
          action === "add" && disponible ? "addDisponible" : action,
          dataToValidate
        );
        if (Object.keys(errors).length > 0) {
          return {
            errors,
            data: dataToValidate,
          };
        }
        if (action === "add") {
          const propiedadesIds = formData.getAll("propiedad") as string[];
          if (
            propiedadesIds.length === 0 ||
            propiedadesIds.some((id) => id === null || id === "")
          ) {
            return {
              data: dataToValidate,
              errors: {
                propiedad: "Debe seleccionar al menos una propiedad",
              },
            };
          }
        }
      }

      const id = renta?.id ?? 0;
      const created_at = renta?.created_at ?? new Date();
      const updated_at = new Date();
      setOptimisticData({
        id,
        created_at,
        updated_at,
        ...dataToValidate,
      } as IRenta | null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/renta${
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

        if (action === "add") {
          const propiedadesIds = formData.getAll("propiedad") as string[];
          const responseData = await res.json();

          const newRenta = responseData as IRenta;

          const addPropiedades = await Promise.all(
            propiedadesIds.map(async (id) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/renta/${newRenta.id}/propiedad/${id}`,
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
              data: dataToValidate,
              message: "Error adding propiedades",
            };
          }
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
    [renta, action, disponible, refresh, onClose, setOptimisticData]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, data, message } = state ?? {};

  const transformedPropiedades = propiedades.map(({ id, nombre, ...rest }) => ({
    key: id.toString(),
    name: nombre,
    ...rest,
  }));

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="disabled:opacity-50 space-y-4">
        {message && (
          <div className="text-center text-white bg-red-500 p-2 rounded">
            {message}
          </div>
        )}
        {action !== "delete" ? (
          <>
            {action === "add" && (
              <>
                <GenericDiv>
                  <div className="flex items-center gap-2">
                    <GenericInput
                      type="checkbox"
                      id="esta_disponible"
                      ariaLabel="¿Está disponible?"
                      defaultChecked={data?.esta_disponible}
                      onChange={(e) =>
                        setDisponible((e.target as HTMLInputElement).checked)
                      }
                      error={errors?.esta_disponible}
                    />
                  </div>
                </GenericDiv>
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
              </>
            )}
            {!disponible && (
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
                      id="metros_cuadrados_rentados"
                      ariaLabel="Metros Cuadrados Rentados"
                      placeholder="1000"
                      defaultValue={data?.metros_cuadrados_rentados?.toString()}
                      error={errors?.metros_cuadrados_rentados}
                    />
                  </GenericDiv>
                </GenericPairDiv>
                <GenericPairDiv>
                  <GenericDiv>
                    <GenericInput
                      type="number"
                      id="renta_sin_iva"
                      ariaLabel="Renta sin IVA"
                      placeholder="1000"
                      defaultValue={data?.renta_sin_iva?.toString()}
                      error={errors?.renta_sin_iva}
                    />
                  </GenericDiv>
                  <GenericDiv>
                    <GenericInput
                      type="select"
                      id="meses_deposito_garantia"
                      ariaLabel="Meses depósito de Garantía"
                      placeholder="Selecciona un número de meses"
                      defaultValue={data?.meses_deposito_garantia?.toString()}
                      options={Array.from({ length: 10 }, (_, i) => ({
                        value: (i + 1).toString(),
                        label: (i + 1).toString(),
                      }))}
                      error={errors?.meses_deposito_garantia}
                    />
                  </GenericDiv>
                </GenericPairDiv>
                <GenericPairDiv>
                  <GenericDiv>
                    <GenericInput
                      type="select"
                      id="meses_gracia"
                      ariaLabel="Meses de Gracia"
                      placeholder="Selecciona un número de meses"
                      defaultValue={data?.meses_gracia?.toString()}
                      options={Array.from({ length: 10 }, (_, i) => ({
                        value: (i + 1).toString(),
                        label: (i + 1).toString(),
                      }))}
                      error={errors?.meses_gracia}
                    />
                  </GenericDiv>
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
                          ? formatdateInput(
                              data.meses_gracia_fecha_fin.toString()
                            )
                          : ""
                      }
                      error={errors?.meses_gracia_fecha_fin}
                    />
                  </GenericDiv>
                </GenericPairDiv>
                <GenericPairDiv>
                  <GenericDiv>
                    <GenericInput
                      type="select"
                      id="meses_renta_anticipada"
                      ariaLabel="Meses Renta Anticipada"
                      placeholder="Selecciona un número de meses"
                      defaultValue={data?.meses_renta_anticipada?.toString()}
                      options={Array.from({ length: 10 }, (_, i) => ({
                        value: (i + 1).toString(),
                        label: (i + 1).toString(),
                      }))}
                      error={errors?.meses_renta_anticipada}
                    />
                  </GenericDiv>
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
                </GenericPairDiv>
                <GenericPairDiv>
                  <GenericDiv>
                    <GenericInput
                      type="select"
                      id="incremento_mes"
                      ariaLabel="Incremento Mes"
                      placeholder="Selecciona un mes"
                      defaultValue={data?.incremento_mes}
                      options={[
                        { value: "Enero", label: "Enero" },
                        { value: "Febrero", label: "Febrero" },
                        { value: "Marzo", label: "Marzo" },
                        { value: "Abril", label: "Abril" },
                        { value: "Mayo", label: "Mayo" },
                        { value: "Junio", label: "Junio" },
                        { value: "Julio", label: "Julio" },
                        { value: "Agosto", label: "Agosto" },
                        { value: "Septiembre", label: "Septiembre" },
                        { value: "Octubre", label: "Octubre" },
                        { value: "Noviembre", label: "Noviembre" },
                        { value: "Diciembre", label: "Diciembre" },
                      ]}
                      error={errors?.incremento_mes}
                    />
                  </GenericDiv>
                  <GenericDiv>
                    <GenericInput
                      type="textarea"
                      id="incremento_nota"
                      ariaLabel="Incremento Nota"
                      placeholder="Incremento"
                      defaultValue={data?.incremento_nota}
                      error={errors?.incremento_nota}
                    />
                  </GenericDiv>
                </GenericPairDiv>
                <GenericPairDiv>
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
                  <GenericDiv>
                    <GenericInput
                      type="date"
                      id="fin_vigencia_forzosa"
                      ariaLabel="Fin Vigencia Forzosa"
                      placeholder="2025-02-02"
                      defaultValue={
                        data?.fin_vigencia_forzosa
                          ? formatdateInput(
                              data.fin_vigencia_forzosa.toString()
                            )
                          : ""
                      }
                      error={errors?.fin_vigencia_forzosa}
                    />
                  </GenericDiv>
                </GenericPairDiv>
                <GenericPairDiv>
                  <GenericDiv>
                    <GenericInput
                      type="date"
                      id="fin_vigencia_no_forzosa"
                      ariaLabel="Fin Vigencia No Forzosa"
                      placeholder="2025-02-02"
                      defaultValue={
                        data?.fin_vigencia_no_forzosa
                          ? formatdateInput(
                              data.fin_vigencia_no_forzosa.toString()
                            )
                          : ""
                      }
                      error={errors?.fin_vigencia_no_forzosa}
                    />
                  </GenericDiv>
                  <GenericDiv>
                    <GenericInput
                      type="textarea"
                      id="vigencia_nota"
                      ariaLabel="Vigencia Nota"
                      placeholder="Vigencia"
                      defaultValue={data?.vigencia_nota}
                      error={errors?.vigencia_nota}
                    />
                  </GenericDiv>
                </GenericPairDiv>
              </>
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
