"use client";

import validateProjectsSchema from "../schemas";
import { useCallback, useActionState, useState } from "react";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import type {
  IProyecto,
  IVocacion,
  ISituacionFisica,
  IVocacionEspecifica,
} from "@/app/shared/interfaces";
import { generateFileKey } from "@/app/shared/utils/generateFileKey";
import { deleteBlob, generateSignedUploadUrl } from "@/app/shared/utils/azure";
import { extractBlobName } from "@/app/shared/utils/extractBlobName";

interface IProyectoState {
  message?: string;
  data?: {
    nombre?: string;
    superficie_total?: number;
    esta_activo?: boolean;
    comentarios?: string;
    situacion_fisica_id?: number;
    vocacion_id?: number;
    vocacion_especifica_id?: number;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  action: "add" | "edit" | "delete";
  proyecto: IProyecto | null;
  vocaciones: IVocacion[];
  situacionesFisicas: ISituacionFisica[];
  vocacionesEspecificas: IVocacionEspecifica[];
  setOptimisticData: (data: IProyecto | null) => void;
  onClose: () => void;
  refresh: () => void;
}

const Form = ({
  action,
  proyecto,
  vocaciones,
  situacionesFisicas,
  vocacionesEspecificas,
  setOptimisticData,
  onClose,
  refresh,
}: IForm) => {
  const [files, setFiles] = useState<FileList | null>(null);

  const initialState: IProyectoState = {
    errors: {},
    message: "",
    data: proyecto,
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        nombre: formData.get("nombre")
          ? (formData.get("nombre") as string)
          : undefined,
        superficie_total: formData.get("superficie_total")
          ? parseFloat(formData.get("superficie_total") as string)
          : undefined,
        esta_activo: formData.get("esta_activo") === "on",
        comentarios: formData.get("comentarios")
          ? (formData.get("comentarios") as string)
          : undefined,
        situacion_fisica_id: formData.get("situacion_fisica_id")
          ? parseInt(formData.get("situacion_fisica_id") as string)
          : undefined,
        vocacion_id: formData.get("vocacion_id")
          ? parseInt(formData.get("vocacion_id") as string)
          : undefined,
        vocacion_especifica_id: formData.get("vocacion_especifica_id")
          ? parseInt(formData.get("vocacion_especifica_id") as string)
          : undefined,
      };

      if (action !== "delete") {
        const errors = validateProjectsSchema(action, dataToValidate);
        if (Object.keys(errors).length > 0) {
          return {
            errors,
            data: dataToValidate,
          };
        }

        if (
          action === "add" &&
          (!files ||
            files.length === 0 ||
            Array.from(files).some((file) => file.size === 0))
        ) {
          return {
            errors: {
              files: "No se han seleccionado archivos",
            },
            data: dataToValidate,
          };
        }
      }

      const id = proyecto?.id ?? 0;
      const created_at = proyecto?.created_at ?? new Date();
      const updated_at = new Date();
      setOptimisticData({
        id,
        created_at,
        updated_at,
        ...dataToValidate,
      } as IProyecto | null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/proyecto${
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
            } proyecto`,
          };
        }

        if (action === "add") {
          const responseData = await res.json();
          const newProyecto = responseData as IProyecto;

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

          await Promise.all(
            uploadResults.map(async (url) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/archivo/tabla/proyecto/id/${newProyecto.id}`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    url,
                  }),
                }
              );

              if (!res.ok) {
                throw new Error("Error uploading file to blob storage");
              }
            })
          );
        }

        if (action === "delete") {
          const deleteResp = await Promise.all(
            proyecto?.archivos.map(async (archivo) => {
              return await deleteBlob(extractBlobName(archivo.url, "my-files"));
            }) ?? []
          );
          if (deleteResp.includes(false)) {
            throw new Error("Error deleting files from blob storage");
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
    [proyecto, refresh, action, files, onClose, setOptimisticData]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, data, message } = state ?? {};

  const transformedSituacionesFisicas = situacionesFisicas.map(
    ({ id, nombre }) => ({
      key: id.toString(),
      name: nombre,
    })
  );

  const transformedVocaciones = vocaciones.map(({ id, valor }) => ({
    key: id.toString(),
    name: valor,
  }));

  const transformedVocacionesEspecificas = vocacionesEspecificas.map(
    ({ id, valor }) => ({
      key: id.toString(),
      name: valor,
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
                  placeholder="Sunmall"
                  defaultValue={data?.nombre}
                  error={errors?.nombre}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="superficie_total"
                  ariaLabel="Superficie Total"
                  placeholder="5302.98"
                  step="0.01"
                  defaultValue={data?.superficie_total?.toString()}
                  error={errors?.superficie_total}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="select"
                  id="situacion_fisica_id"
                  ariaLabel="Situación Física"
                  placeholder="Selecciona una situación física..."
                  error={errors?.situacion_fisica_id}
                  defaultValue={data?.situacion_fisica_id?.toString()}
                  options={transformedSituacionesFisicas.map((i) => ({
                    value: i.key,
                    label: i.name,
                  }))}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="select"
                  id="vocacion_id"
                  ariaLabel="Vocación"
                  placeholder="Selecciona una vocación..."
                  error={errors?.vocacion_id}
                  defaultValue={data?.vocacion_id?.toString()}
                  options={transformedVocaciones.map((i) => ({
                    value: i.key,
                    label: i.name,
                  }))}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="select"
                  id="vocacion_especifica_id"
                  ariaLabel="Vocación Específica"
                  placeholder="Selecciona una vocación específica..."
                  error={errors?.vocacion_especifica_id}
                  defaultValue={data?.vocacion_especifica_id?.toString()}
                  options={transformedVocacionesEspecificas.map((i) => ({
                    value: i.key,
                    label: i.name,
                  }))}
                />
              </GenericDiv>
            </GenericPairDiv>
            <div className="flex flex-col gap-2 w-full">
              <GenericInput
                type="textarea"
                id="comentarios"
                ariaLabel="Comentarios"
                placeholder="Pendiente de revisión"
                defaultValue={data?.comentarios}
                error={errors?.comentarios}
              />
            </div>
            {action === "add" && (
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
            )}
            <div className="flex gap-2 items-center justify-end">
              <GenericInput
                type="checkbox"
                id="esta_activo"
                ariaLabel="¿Es un proyecto activo?"
                defaultChecked={data?.esta_activo ?? true}
              />
            </div>
          </>
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar el proyecto{" "}
              <span className="font-bold">{proyecto?.nombre}?</span>
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
