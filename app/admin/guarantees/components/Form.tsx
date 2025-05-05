"use client";

import validateGuaranteesSchema from "../schemas";
import { useCallback, useActionState, useState } from "react";
import formatdateInput from "@/app/shared/utils/formatdate-input";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import { generateFileKey } from "@/app/shared/utils/generateFileKey";
import { deleteBlob, generateSignedUploadUrl } from "@/app/shared/utils/azure";
import { extractBlobName } from "@/app/shared/utils/extractBlobName";
import type { IGarantia } from "@/app/shared/interfaces";

interface IRentaState {
  message?: string;
  data?: {
    beneficiario?: string;
    monto?: number;
    fecha_inicio?: Date;
    fecha_fin?: Date;
  } | null;
  errors?: {
    [key: string]: string;
  };
}

interface IForm {
  onClose: () => void;
  garantia: IGarantia | null;
  action: "add" | "edit" | "delete";
  setOptimisticData: (data: IGarantia | null) => void;
  refresh: () => void;
}

const Form = ({
  garantia,
  action,
  onClose,
  setOptimisticData,
  refresh,
}: IForm) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const initialState: IRentaState = {
    errors: {},
    message: "",
    data: garantia,
  };

  const formAction = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const dataToValidate = {
        beneficiario: formData.get("beneficiario")
          ? (formData.get("beneficiario") as string)
          : undefined,
        monto: formData.get("monto")
          ? parseFloat(formData.get("monto") as string)
          : undefined,
        fecha_inicio: formData.get("fecha_inicio")
          ? new Date(formData.get("fecha_inicio") as string)
          : undefined,
        fecha_fin: formData.get("fecha_fin")
          ? new Date(formData.get("fecha_fin") as string)
          : undefined,
      };

      if (action !== "delete") {
        const errors = validateGuaranteesSchema(action, dataToValidate);
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

      const id = garantia?.id ?? 0;
      const created_at = garantia?.created_at ?? new Date();
      const updated_at = new Date();
      setOptimisticData({
        id,
        created_at,
        updated_at,
        ...dataToValidate,
      } as IGarantia | null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/garantia${
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
          const responseData = await res.json();
          const newGarantia = responseData as IGarantia;

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
                `${process.env.NEXT_PUBLIC_API_URL}/archivo/tabla/garantia/id/${newGarantia.id}`,
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
            garantia?.archivos.map(async (archivo) => {
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
    [garantia, files, refresh, action, onClose, setOptimisticData]
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
          <>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="beneficiario"
                  ariaLabel="Nombre del beneficiario"
                  placeholder="Juan Pérez"
                  defaultValue={data?.beneficiario}
                  error={errors?.beneficiario}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="monto"
                  ariaLabel="Monto"
                  placeholder="1000"
                  defaultValue={data?.monto?.toString()}
                  error={errors?.monto}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="date"
                  id="fecha_inicio"
                  ariaLabel="Fecha de inicio"
                  placeholder="2022-01-01"
                  defaultValue={
                    data?.fecha_inicio
                      ? formatdateInput(data.fecha_inicio.toString())
                      : ""
                  }
                  error={errors?.fecha_inicio}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="date"
                  id="fecha_fin"
                  ariaLabel="Fecha de fin"
                  placeholder="2022-01-01"
                  defaultValue={
                    data?.fecha_fin
                      ? formatdateInput(data.fecha_fin.toString())
                      : ""
                  }
                  error={errors?.fecha_fin}
                />
              </GenericDiv>
            </GenericPairDiv>
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
          </>
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar la garantía{" "}
              <span className="font-bold">{garantia?.beneficiario}?</span>
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
