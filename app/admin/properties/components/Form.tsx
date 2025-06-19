"use client";

import validatePropertiesSchema from "../schemas";
import { useActionState, useCallback, useState } from "react";
import {
  GenericInput,
  SubmitButton,
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components";
import type {
  IProyecto,
  IGarantia,
  IPropiedad,
  IUbicacion,
  IProcesoLegal,
  IPropietario,
} from "@/app/shared/interfaces";
import { generateFileKey } from "@/app/shared/utils/generateFileKey";
import { deleteBlob, generateSignedUploadUrl } from "@/app/shared/utils/azure";
import { extractBlobName } from "@/app/shared/utils/extractBlobName";

interface IPropertiesState {
  message?: string;
  data?: {
    nombre?: string;
    superficie?: number;
    valor_comercial?: number;
    anio_valor_comercial?: number;
    clave_catastral?: string;
    base_predial?: number;
    adeudo_predial?: number;
    anios_pend_predial?: number;
    comentarios?: string;
    proyecto_id?: number;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  garantias: IGarantia[];
  proyectos: IProyecto[];
  propietarios: IPropietario[];
  ubicaciones: IUbicacion[];
  propiedad: IPropiedad | null;
  procesosLegales: IProcesoLegal[];
  action: "add" | "edit" | "delete";
  onClose: () => void;
  refresh: () => void;
  setOptimisticData: (data: IPropiedad | null) => void;
}

const Form = ({
  action,
  propiedad,
  proyectos,
  garantias,
  propietarios,
  ubicaciones,
  procesosLegales,
  onClose,
  refresh,
  setOptimisticData,
}: IForm) => {
  const [files, setFiles] = useState<FileList | null>(null);

  const initialState: IPropertiesState = {
    errors: {},
    message: "",
    data: propiedad,
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        nombre: formData.get("nombre")
          ? (formData.get("nombre") as string)
          : undefined,
        superficie: formData.get("superficie")
          ? parseFloat(formData.get("superficie") as string)
          : undefined,
        valor_comercial: formData.get("valor_comercial")
          ? parseFloat(formData.get("valor_comercial") as string)
          : undefined,
        anio_valor_comercial: formData.get("anio_valor_comercial")
          ? parseInt(formData.get("anio_valor_comercial") as string)
          : undefined,
        clave_catastral: formData.get("clave_catastral")
          ? (formData.get("clave_catastral") as string)
          : undefined,
        base_predial: formData.get("base_predial")
          ? parseFloat(formData.get("base_predial") as string)
          : undefined,
        adeudo_predial: formData.get("adeudo_predial")
          ? parseFloat(formData.get("adeudo_predial") as string)
          : undefined,
        anios_pend_predial: formData.get("anios_pend_predial")
          ? parseInt(formData.get("anios_pend_predial") as string)
          : undefined,
        comentarios: formData.get("comentarios")
          ? (formData.get("comentarios") as string)
          : undefined,
        proyecto_id: formData.get("proyecto_id")
          ? parseInt(formData.get("proyecto_id") as string)
          : undefined,
      };

      if (action !== "delete") {
        const errors = validatePropertiesSchema(action, dataToValidate);
        if (Object.keys(errors).length > 0) {
          return { errors, data: dataToValidate };
        }
        if (action === "add") {
          const propietariosIds = formData.getAll(
            "propietario_socio"
          ) as string[];
          if (
            propietariosIds.length === 0 ||
            propietariosIds.some((id) => id === null || id === "")
          ) {
            return {
              data: dataToValidate,
              errors: {
                propietario_socio:
                  "Debes seleccionar al menos un propietario/socio ",
              },
            };
          }
          const sociedadesValues = formData.getAll("sociedad") as string[];
          if (
            sociedadesValues.length === 0 ||
            sociedadesValues.some((val) => val === null || val === "")
          ) {
            return {
              data: dataToValidate,
              errors: {
                sociedad:
                  "Debes escribir al menos un porcentaje de participación",
              },
            };
          }
          if (propietariosIds.length !== sociedadesValues.length) {
            return {
              data: dataToValidate,
              errors: {
                propietario_socio:
                  "El número de propietarios/socios y sociedades no coincide",
                sociedad:
                  "El número de propietarios/socios y sociedades no coincide",
              },
            };
          }
          const esSociosValues: boolean[] = propietariosIds.map((_, index) => {
            const checkbox = formData.get(`propietario_${index}_es_socio`);
            return checkbox === "on" ? true : false;
          });
          let propietariosSuma = 0;
          let sociosSuma = 0;
          let hayPropietarios = false;
          let haySocios = false;
          for (let i = 0; i < propietariosIds.length; i++) {
            const val = parseFloat(sociedadesValues[i]);
            if (isNaN(val)) {
              return {
                data: dataToValidate,
                errors: {
                  sociedad: "El porcentaje de participación debe ser un número",
                },
              };
            }
            if (esSociosValues[i]) {
              haySocios = true;
              sociosSuma += val;
            } else {
              hayPropietarios = true;
              propietariosSuma += val;
            }
          }
          if (hayPropietarios && propietariosSuma !== 100) {
            return {
              data: dataToValidate,
              errors: {
                propietario_socio: `La suma de participación de propietarios debe ser exactamente 100%. Actualmente es ${propietariosSuma}%.`,
              },
            };
          }
          if (haySocios && sociosSuma !== 100) {
            return {
              data: dataToValidate,
              errors: {
                propietario_socio: `La suma de participación de socios debe ser exactamente 100%. Actualmente es ${sociosSuma}%.`,
              },
            };
          }

          const ubicacionesIds = formData.getAll("ubicacion") as string[];
          if (
            ubicacionesIds.length === 0 ||
            ubicacionesIds.some((id) => id === null || id === "")
          ) {
            return {
              data: dataToValidate,
              errors: {
                ubicacion: "Debes seleccionar al menos una ubicación",
              },
            };
          }

          if (
            !files ||
            files.length === 0 ||
            Array.from(files).some((file) => file.size === 0)
          ) {
            return {
              errors: {
                files: "No se han seleccionado archivos",
              },
              data: dataToValidate,
            };
          }
        }
      }

      const id = propiedad?.id ?? 0;
      const created_at = propiedad?.created_at ?? new Date();
      const updated_at = new Date();
      setOptimisticData({
        id,
        created_at,
        updated_at,
        ...dataToValidate,
      } as IPropiedad | null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/propiedad${
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
            } propiedad`,
          };
        }

        if (action === "add") {
          const propietariosIds = formData.getAll(
            "propietario_socio"
          ) as string[];
          const esSociosValues: boolean[] = propietariosIds.map((_, index) => {
            const checkbox = formData.get(`propietario_${index}_es_socio`);
            return checkbox === "on" ? true : false;
          });
          const sociedadesValues = formData.getAll("sociedad") as string[];
          const ubicacionesIds = formData.getAll("ubicacion") as string[];
          const garantiasIds = formData.getAll("garantia") as string[];
          const procesosLegalesIds = formData.getAll(
            "proceso_legal"
          ) as string[];

          const responseData = await res.json();
          const newPropiedad = responseData as IPropiedad;

          const addPropietarioSociedad = await Promise.all(
            propietariosIds.map(async (id, index) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/propiedad/${newPropiedad.id}/propietario/${id}/sociedad/${sociedadesValues[index]}/es_socio/${esSociosValues[index]}`,
                {
                  method: "POST",
                  credentials: "include",
                }
              );
              return res.ok;
            })
          );
          if (addPropietarioSociedad.includes(false)) {
            return {
              data: dataToValidate,
              message: "Error adding propietario_sociedad",
            };
          }

          const addUbicaciones = await Promise.all(
            ubicacionesIds.map(async (id) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/propiedad/${newPropiedad.id}/ubicacion/${id}`,
                {
                  method: "POST",
                  credentials: "include",
                }
              );
              return res.ok;
            })
          );
          if (addUbicaciones.includes(false)) {
            return {
              data: dataToValidate,
              message: "Error adding ubicaciones",
            };
          }

          if (
            garantiasIds.length !== 0 &&
            garantiasIds.every((id) => id !== null && id !== "")
          ) {
            const addGarantias = await Promise.all(
              garantiasIds.map(async (id) => {
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/propiedad/${newPropiedad.id}/garantia/${id}`,
                  {
                    method: "POST",
                    credentials: "include",
                  }
                );
                return res.ok;
              })
            );
            if (addGarantias.includes(false)) {
              return {
                data: dataToValidate,
                message: "Error adding garantias",
              };
            }
          }

          if (
            procesosLegalesIds.length !== 0 &&
            procesosLegalesIds.every((id) => id !== null && id !== "")
          ) {
            const addProcesosLegales = await Promise.all(
              procesosLegalesIds.map(async (id) => {
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/propiedad/${newPropiedad.id}/proceso_legal/${id}`,
                  {
                    method: "POST",
                    credentials: "include",
                  }
                );
                return res.ok;
              })
            );
            if (addProcesosLegales.includes(false)) {
              return {
                data: dataToValidate,
                message: "Error adding procesos legales",
              };
            }
          }

          const fileKeys = Array.from(files!).map((file) =>
            generateFileKey(file)
          );
          const uploadResults = await Promise.all(
            fileKeys.map(async (fileKey, index) => {
              const { url, publicUrl } = await generateSignedUploadUrl(
                fileKey,
                files![index].type
              );

              const res = await fetch(url, {
                method: "PUT",
                headers: {
                  "x-ms-blob-type": "BlockBlob",
                  "Content-Type": files![index].type,
                },
                body: files![index],
              });

              if (!res.ok) {
                throw new Error("Error uploading file to blob storage");
              }

              return publicUrl;
            })
          );

          const uploadFiles = await Promise.all(
            uploadResults.map(async (url) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/archivo/tabla/propiedad/id/${newPropiedad.id}`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ url }),
                }
              );
              return res.ok;
            })
          );
          if (uploadFiles.includes(false)) {
            return {
              data: dataToValidate,
              message: "Error uploading files",
            };
          }
        }

        if (action === "delete") {
          const deleteResp = await Promise.all(
            propiedad?.archivos.map(async (archivo) => {
              return await deleteBlob(extractBlobName(archivo.url, "my-files"));
            }) ?? []
          );
          if (deleteResp.includes(false)) {
            return {
              data: dataToValidate,
              message: "Error deleting files",
            };
          }
        }
      } catch (error) {
        console.error(error);
        return {
          data: dataToValidate,
          message: "Error interno",
        };
      } finally {
        refresh();
        onClose();
      }
    },
    [action, files, propiedad, refresh, onClose, setOptimisticData]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, data, message } = state ?? {};

  const transformedPropietarios = propietarios.map(
    ({ id, nombre, ...rest }) => ({
      key: id.toString(),
      name: nombre,
      ...rest,
    })
  );

  const transformedUbicaciones = ubicaciones.map(({ id, nombre, ...rest }) => ({
    key: id.toString(),
    name: nombre,
    ...rest,
  }));

  const transformedGarantias = garantias.map(({ id, monto, ...rest }) => ({
    key: id.toString(),
    name: monto.toString(),
    ...rest,
  }));

  const transformedProcesosLegales = procesosLegales.map(
    ({ id, abogado, ...rest }) => ({
      key: id.toString(),
      name: abogado,
      ...rest,
    })
  );

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
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="nombre"
                  ariaLabel="Nombre"
                  placeholder="SUN A-1"
                  defaultValue={data?.nombre ?? ""}
                  error={errors?.nombre}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  step="0.01"
                  id="superficie"
                  ariaLabel="Superficie"
                  placeholder="47.92"
                  defaultValue={data?.superficie?.toString()}
                  error={errors?.superficie}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  step="0.01"
                  id="valor_comercial"
                  ariaLabel="Valor Comercial"
                  placeholder="1980677.36"
                  defaultValue={data?.valor_comercial?.toString() ?? ""}
                  error={errors?.valor_comercial}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="select"
                  id="proyecto_id"
                  ariaLabel="Proyecto"
                  error={errors?.proyecto_id}
                  placeholder="Selecciona un proyecto..."
                  defaultValue={data?.proyecto_id?.toString() ?? ""}
                  options={proyectos.map((p) => ({
                    value: p.id.toString(),
                    label: p.nombre,
                  }))}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="anio_valor_comercial"
                  ariaLabel="Año Valor Comercial"
                  placeholder="2023"
                  defaultValue={data?.anio_valor_comercial?.toString() ?? ""}
                  error={errors?.anio_valor_comercial}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="clave_catastral"
                  ariaLabel="Clave Catastral"
                  placeholder="360030958001"
                  defaultValue={data?.clave_catastral ?? ""}
                  error={errors?.clave_catastral}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  step="0.01"
                  id="base_predial"
                  ariaLabel="Base Predial"
                  placeholder="916.0"
                  defaultValue={data?.base_predial?.toString() ?? ""}
                  error={errors?.base_predial}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  step="0.01"
                  id="adeudo_predial"
                  ariaLabel="Adeudo Predial"
                  placeholder="200.0"
                  defaultValue={data?.adeudo_predial?.toString() ?? ""}
                  error={errors?.adeudo_predial}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="anios_pend_predial"
                  ariaLabel="Años Pend. Predial"
                  placeholder="2"
                  defaultValue={data?.anios_pend_predial?.toString() ?? ""}
                  error={errors?.anios_pend_predial}
                />
              </GenericDiv>
            </GenericPairDiv>
            <div className="flex flex-col gap-2 w-full">
              <GenericInput
                type="textarea"
                id="comentarios"
                ariaLabel="Comentarios"
                placeholder="Sin comentarios"
                defaultValue={data?.comentarios ?? ""}
                error={errors?.comentarios}
              />
            </div>
            {action === "add" && (
              <>
                <DynamicItemManager
                  items={transformedPropietarios ?? []}
                  renderForm={(index, items, onSelect) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-2"
                    >
                      <div className="w-full md:w-2/3">
                        <AutocompleteInput
                          id="propietario_socio"
                          ariaLabel="Propietario/Socio"
                          customClassName="mt-2"
                          error={errors?.propietario_socio}
                          placeholder="Busca un propietario/socio..."
                          additionOnChange={(e) =>
                            onSelect(index, e.target.value)
                          }
                          suggestions={items.map((i) => ({
                            value: i.key,
                            label: i.name,
                          }))}
                        />
                        <GenericInput
                          id={`propietario_${index}_es_socio`}
                          type="checkbox"
                          ariaLabel="¿Es socio?"
                          labelClassName="mr-2"
                        />
                      </div>
                      <div className=" w-full md:w-1/3">
                        <GenericInput
                          id="sociedad"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          ariaLabel="Porcentaje de participación"
                          placeholder="45"
                          error={errors?.sociedad}
                        />
                      </div>
                    </div>
                  )}
                />
                <DynamicItemManager
                  items={transformedUbicaciones ?? []}
                  renderForm={(index, items, onSelect) => (
                    <AutocompleteInput
                      key={index}
                      id="ubicacion"
                      ariaLabel="Ubicación"
                      customClassName="mt-2"
                      error={errors?.ubicacion}
                      placeholder="Busca un ubicación..."
                      additionOnChange={(e) => onSelect(index, e.target.value)}
                      suggestions={items.map((i) => ({
                        value: i.key,
                        label: i.name,
                      }))}
                    />
                  )}
                />
                <DynamicItemManager
                  items={transformedGarantias ?? []}
                  renderForm={(index, items, onSelect) => (
                    <AutocompleteInput
                      key={index}
                      id="garantia"
                      ariaLabel="Garantía (Opcional)"
                      customClassName="mt-2"
                      error={errors?.garantia}
                      placeholder="Busca una garantía... (Opcional)"
                      additionOnChange={(e) => onSelect(index, e.target.value)}
                      suggestions={items.map((i) => ({
                        value: i.key,
                        label: i.name,
                      }))}
                    />
                  )}
                />
                <DynamicItemManager
                  items={transformedProcesosLegales ?? []}
                  renderForm={(index, items, onSelect) => (
                    <AutocompleteInput
                      key={index}
                      id="proceso_legal"
                      ariaLabel="Proceso Legal (Opcional)"
                      customClassName="mt-2"
                      error={errors?.proceso_legal}
                      placeholder="Busca un proceso legal... (Opcional)"
                      additionOnChange={(e) => onSelect(index, e.target.value)}
                      suggestions={items.map((i) => ({
                        value: i.key,
                        label: i.name,
                      }))}
                    />
                  )}
                />
                <GenericInput
                  type="file"
                  id="files"
                  multiple
                  ariaLabel="Archivos"
                  file={files?.length ? files[0] : undefined}
                  onChange={(event) =>
                    setFiles((event.target as HTMLInputElement).files)
                  }
                  error={errors?.files}
                />
              </>
            )}
          </>
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar la propiedad{" "}
              <span className="font-bold">{data?.nombre}?</span>
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
