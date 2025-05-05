"use client";

import { useActionState, useCallback, useState } from "react";
import { generateFileKey } from "@/app/shared/utils/generateFileKey";
import { extractBlobName } from "@/app/shared/utils/extractBlobName";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import { deleteBlob, generateSignedUploadUrl } from "@/app/shared/utils/azure";
import type { IArchivo } from "@/app/shared/interfaces";

interface IFormState {
  message?: string;
  errors?: {
    [key: string]: string;
  };
}

interface IArchivoForm {
  archivo?: IArchivo;
  tabla?: string;
  tablaId?: number;
  refresh: () => void;
  onCloseForm?: () => void;
}

const ArchivoForm = ({
  archivo,
  tabla,
  tablaId,
  refresh,
  onCloseForm,
}: IArchivoForm) => {
  const [files, setFiles] = useState<FileList | null>(null);

  const initialState: IFormState = {
    errors: {},
    message: "",
  };

  const formAction = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_prev: unknown, _formData: FormData) => {
      try {
        if (archivo) {
          const deleteFunc = await deleteBlob(
            extractBlobName(archivo.url, "my-files")
          );
          if (!deleteFunc) {
            return {
              message: "Error deleting file from blob storage",
            };
          }

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/archivo/${archivo.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (!res.ok) {
            return {
              message: "Error deleting file",
            };
          }
        } else {
          if (
            !files ||
            files.length === 0 ||
            Array.from(files).some((file) => file.size === 0)
          ) {
            return {
              errors: {
                files: "No se han seleccionado archivos",
              },
            };
          }

          const fileKeys = Array.from(files).map((file) =>
            generateFileKey(file)
          );
          const uploadResults = await Promise.all(
            fileKeys.map(async (fileKey, index) => {
              const { url, publicUrl } = await generateSignedUploadUrl(
                fileKey,
                files[index].type
              );

              const res = await fetch(url, {
                method: "PUT",
                headers: {
                  "x-ms-blob-type": "BlockBlob",
                  "Content-Type": files[index].type,
                },
                body: files[index],
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
                `${process.env.NEXT_PUBLIC_API_URL}/archivo/tabla/${tabla}/id/${tablaId}`,
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
              return res.ok;
            })
          );
          if (uploadFiles.includes(false)) {
            return {
              message: "Error uploading files",
            };
          }
        }
      } catch (error) {
        console.error(error);
        return {
          message: "Error connecting to the server",
        };
      } finally {
        refresh();
        onCloseForm?.();
      }
    },
    [archivo, tabla, tablaId, files, refresh, onCloseForm]
  );

  const [state, handleSubmit, isPending] = useActionState(
    formAction,
    initialState
  );

  const { errors, message } = state ?? {};

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="disabled:opacity-50 space-y-4">
        {message && (
          <div className="text-center text-white bg-red-500 p-2 rounded">
            {message}
          </div>
        )}
        {!archivo ? (
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
        ) : (
          <div className="text-center">
            <p>
              ¿Estás seguro de que deseas eliminar el archivo{" "}
              <span className="font-bold">
                {extractBlobName(archivo.url, "my-files").toUpperCase()}
              </span>{" "}
              ?
            </p>
          </div>
        )}
        <div className="text-center text-white">
          <SubmitButton
            title={!archivo ? "Crear" : "Eliminar"}
            color={!archivo ? "green" : "red"}
            pending={isPending}
          />
        </div>
      </fieldset>
    </form>
  );
};

export default ArchivoForm;
