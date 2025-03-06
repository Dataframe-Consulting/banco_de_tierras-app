"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GenericInput,
  SubmitButton,
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components";
import type {
  IProyecto,
  IPropiedad,
  IUbicacion,
} from "@/app/shared/interfaces";

interface IForm {
  onClose: () => void;
  data: IPropiedad | null;
  action: "add" | "edit" | "delete";
  setOptimisticData: (data: IPropiedad | null) => void;
  proyectos: IProyecto[];
  ubicaciones: IUbicacion[];
}

const Form = ({
  data,
  action,
  onClose,
  setOptimisticData,
  proyectos,
  ubicaciones,
}: IForm) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());

    const parsedBody = {
      ...body,
      superficie: body.superficie
        ? parseFloat(body.superficie as string)
        : null,
      valor_comercial: body.valor_comercial
        ? parseFloat(body.valor_comercial as string)
        : null,
      anio_valor_comercial: body.anio_valor_comercial
        ? parseInt(body.anio_valor_comercial as string)
        : null,
      base_predial: body.base_predial
        ? parseFloat(body.base_predial as string)
        : null,
      adeudo_predial: body.adeudo_predial
        ? parseFloat(body.adeudo_predial as string)
        : null,
      anios_pend_predial: body.anios_pend_predial
        ? parseInt(body.anios_pend_predial as string)
        : null,
      proyecto_id: body.proyecto_id
        ? parseInt(body.proyecto_id as string)
        : null,
    };

    // startTransition(() => {
    //   setOptimisticData({
    //     id: 0,
    //     ...parsedBody,
    //   } as IRenta);
    // });

    try {
      const res = await fetch(
        `http://localhost:8000/api/propiedad${
          action === "edit" || action === "delete" ? `/${data?.id}` : ""
        }`,
        {
          method:
            action === "delete" ? "DELETE" : action === "edit" ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedBody),
        }
      );

      if (!res.ok) {
        throw new Error(
          `Error ${
            action === "edit"
              ? "updating"
              : action === "delete"
              ? "deleting"
              : "creating"
          } propiedad`
        );
      }

      if (action === "add") {
        const ubicacionesIds = formData.getAll("ubicacion") as string[];
        const responseData = await res.json();

        const newPropiedad = responseData as IPropiedad;

        const addUbicaciones = await Promise.all(
          ubicacionesIds.map(async (id) => {
            const res = await fetch(
              `http://localhost:8000/api/propiedad/${newPropiedad.id}/ubicacion/${id}`,
              {
                method: "POST",
              }
            );
            return res.ok;
          })
        );

        if (addUbicaciones.includes(false)) {
          throw new Error("Error adding ubicaciones");
        }

        console.log("Success adding ubicaciones");
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  const transformedUbicaciones = ubicaciones.map(({ id, nombre, ...rest }) => ({
    key: id.toString(),
    name: nombre,
    ...rest,
  }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="disabled:opacity-50 space-y-4">
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
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="superficie"
                  ariaLabel="Superficie"
                  placeholder="47.92"
                  defaultValue={data?.superficie.toString() ?? ""}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="valor_comercial"
                  ariaLabel="Valor Comercial"
                  placeholder="1980677.36"
                  defaultValue={data?.valor_comercial.toString() ?? ""}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="select"
                  id="proyecto_id"
                  ariaLabel="Proyecto"
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
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="clave_catastral"
                  ariaLabel="Clave Catastral"
                  placeholder="360030958001"
                  defaultValue={data?.clave_catastral ?? ""}
                />
              </GenericDiv>
            </GenericPairDiv>
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="base_predial"
                  ariaLabel="Base Predial"
                  placeholder="916.0"
                  defaultValue={data?.base_predial.toString() ?? ""}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="adeudo_predial"
                  ariaLabel="Adeudo Predial"
                  placeholder="200.0"
                  defaultValue={data?.adeudo_predial?.toString() ?? ""}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  id="anios_pend_predial"
                  ariaLabel="Años Pend. Predial"
                  placeholder="2"
                  defaultValue={data?.anios_pend_predial?.toString() ?? ""}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="comentarios"
                  ariaLabel="Comentarios"
                  placeholder="Sin comentarios"
                  defaultValue={data?.comentarios ?? ""}
                />
              </GenericDiv>
            </GenericPairDiv>
            {action === "add" && (
              <DynamicItemManager
                items={transformedUbicaciones ?? []}
                renderForm={(index, items, onSelect) => (
                  <AutocompleteInput
                    key={index}
                    id="ubicacion"
                    ariaLabel="Ubicación"
                    customClassName="mt-2"
                    placeholder="Busca un ubicación..."
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
