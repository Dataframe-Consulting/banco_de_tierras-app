"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SearchBar, ProjectsDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type {
  IProyecto,
  IVocacion,
  ISituacionFisica,
  IVocacionEspecifica,
} from "@/app/shared/interfaces";

const ProjectsPageContent = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<IProyecto[]>([]);
  const [vocaciones, setVocaciones] = useState<IVocacion[]>([]);
  const [situacionesFisicas, setSituacionesFisicas] = useState<
    ISituacionFisica[]
  >([]);
  const [vocacionesEspecificas, setVocacionesEspecificas] = useState<
    IVocacionEspecifica[]
  >([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const vocacion_id = searchParams.get("vocacion_id") || "";
  const situacion_fisica_id = searchParams.get("situacion_fisica_id") || "";
  const vocacion_especifica_id =
    searchParams.get("vocacion_especifica_id") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const fetchWithAuth = async (endpoint: string) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
            { credentials: "include" }
          );
          return response.json();
        };

        const [
          vocacionesData,
          situacionesFisicasData,
          vocacionesEspecificasData,
        ] = await Promise.all([
          fetchWithAuth("vocacion/"),
          fetchWithAuth("situacion_fisica/"),
          fetchWithAuth("vocacion_especifica/"),
        ]);

        setVocaciones(vocacionesData);
        setSituacionesFisicas(situacionesFisicasData);
        setVocacionesEspecificas(vocacionesEspecificasData);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/proyecto/`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);
        if (vocacion_id) params.append("vocacion_id", vocacion_id);
        if (situacion_fisica_id)
          params.append("situacion_fisica_id", situacion_fisica_id);
        if (vocacion_especifica_id)
          params.append("vocacion_especifica_id", vocacion_especifica_id);

        const projectsResponse = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, vocacion_id, situacion_fisica_id, vocacion_especifica_id, refresh]);

  return (
    <>
      <SearchBar
        vocaciones={vocaciones}
        situacionesFisicas={situacionesFisicas}
        vocacionesEspecificas={vocacionesEspecificas}
      />
      {loading ? (
        <DatatableSkeleton />
      ) : (
        <ProjectsDataTable
          projects={projects}
          vocaciones={vocaciones}
          situacionesFisicas={situacionesFisicas}
          vocacionesEspecificas={vocacionesEspecificas}
          refresh={() => setRefresh((prev) => !prev)}
        />
      )}
    </>
  );
};

const ProjectsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <ProjectsPageContent />
    </Suspense>
  );
};

export default ProjectsPage;
