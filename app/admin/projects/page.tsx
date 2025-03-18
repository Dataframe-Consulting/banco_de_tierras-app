import { Suspense } from "react";
import { cookies } from "next/headers";
import { SearchBar, ProjectsDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type {
  IProyecto,
  IVocacion,
  IPropietario,
  ISituacionFisica,
  IVocacionEspecifica,
} from "@/app/shared/interfaces";

interface IProjectsPage {
  searchParams?: Promise<{ [key: string]: string }>;
}

const ProjectsPage = async ({ searchParams }: IProjectsPage) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  const {
    q = "",
    vocacion_id = "",
    propietario_id = "",
    situacion_fisica_id = "",
    vocacion_especifica_id = "",
  } = (await searchParams) || {};

  const searchParamsForDataTable = {
    q,
    vocacion_id,
    propietario_id,
    situacion_fisica_id,
    vocacion_especifica_id,
  };

  const [
    vocaciones,
    propietarios,
    situaciones_fisicas,
    vocaciones_especificas,
  ] = await Promise.all([
    fetch("http://localhost:8000/api/vocacion", {
      headers: {
        Authorization: `${token?.value}`,
      },
    }),
    fetch("http://localhost:8000/api/propietario", {
      headers: {
        Authorization: `${token?.value}`,
      },
    }),
    fetch("http://localhost:8000/api/situacion_fisica", {
      headers: {
        Authorization: `${token?.value}`,
      },
    }),
    fetch("http://localhost:8000/api/vocacion_especifica", {
      headers: {
        Authorization: `${token?.value}`,
      },
    }),
  ]);

  const vocacionesData = (await vocaciones.json()) as IVocacion[];
  const propietariosData = (await propietarios.json()) as IPropietario[];
  const situacionesFisicasData =
    (await situaciones_fisicas.json()) as ISituacionFisica[];
  const vocacionesEspecificasData =
    (await vocaciones_especificas.json()) as IVocacionEspecifica[];

  return (
    <>
      <SearchBar
        vocaciones={vocacionesData}
        propietarios={propietariosData}
        situacionesFisicas={situacionesFisicasData}
        vocacionesEspecificas={vocacionesEspecificasData}
      />
      <Suspense
        fallback={<DatatableSkeleton />}
        key={
          q +
          vocacion_id +
          propietario_id +
          situacion_fisica_id +
          vocacion_especifica_id
        }
      >
        <DataFetch
          token={token?.value}
          vocaciones={vocacionesData}
          propietarios={propietariosData}
          searchParams={searchParamsForDataTable}
          situacionesFisicas={situacionesFisicasData}
          vocacionesEspecificas={vocacionesEspecificasData}
        />
      </Suspense>
    </>
  );
};

export default ProjectsPage;

interface IDataFetch {
  token?: string;
  vocaciones: IVocacion[];
  propietarios: IPropietario[];
  situacionesFisicas: ISituacionFisica[];
  vocacionesEspecificas: IVocacionEspecifica[];
  searchParams: {
    q?: string;
    vocacion_id?: string;
    propietario_id?: string;
    situacion_fisica_id?: string;
    vocacion_especifica_id?: string;
  };
}

const DataFetch = async ({
  token,
  vocaciones,
  propietarios,
  searchParams,
  situacionesFisicas,
  vocacionesEspecificas,
}: IDataFetch) => {
  const url = new URL("http://localhost:8000/api/proyecto");
  const params = new URLSearchParams();

  if (searchParams.q) params.append("q", searchParams.q);
  if (searchParams.vocacion_id)
    params.append("vocacion_id", searchParams.vocacion_id);
  if (searchParams.propietario_id)
    params.append("propietario_id", searchParams.propietario_id);
  if (searchParams.situacion_fisica_id)
    params.append("situacion_fisica_id", searchParams.situacion_fisica_id);
  if (searchParams.vocacion_especifica_id)
    params.append(
      "vocacion_especifica_id",
      searchParams.vocacion_especifica_id
    );

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  const projectsData = (await response.json()) as IProyecto[];

  return (
    <ProjectsDataTable
      projects={projectsData}
      vocaciones={vocaciones}
      propietarios={propietarios}
      situacionesFisicas={situacionesFisicas}
      vocacionesEspecificas={vocacionesEspecificas}
    />
  );
};
