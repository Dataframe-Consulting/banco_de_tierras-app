import React from "react";

interface IPageLayoutProps {
  searchBar: React.ReactNode;
  children: React.ReactNode;
  addButton?: React.ReactNode;
  className?: string;
}

/**
 * Componente de layout para páginas con filtros y tablas
 * 
 * Parámetros
 * ----------
 * searchBar : React.ReactNode
 *     Componente de filtros que se mantendrá fijo arriba
 * children : React.ReactNode
 *     Contenido principal (normalmente una tabla) que tendrá scroll propio
 * addButton : React.ReactNode, opcional
 *     Botón de añadir elemento que aparecerá a la izquierda de los filtros
 * className : string, opcional
 *     Clases CSS adicionales para el contenedor principal
 * 
 * Retorna
 * -------
 * JSX.Element
 *     Layout estructurado con filtros fijos y área de scroll
 */
const PageLayout: React.FC<IPageLayoutProps> = ({
  searchBar,
  children,
  addButton,
  className = "",
}) => {
  return (
    <div className={`h-screen px-4 flex flex-col ${className}`}>
      {/* Área de filtros fija */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-4">
          {addButton && (
            <div className="flex-shrink-0">
              {addButton}
            </div>
          )}
          <div className="flex-1">
            {searchBar}
          </div>
        </div>
      </div>
      
      {/* Área de contenido que ocupa el resto del espacio disponible */}
      <div className="flex-1 min-h-0 overflow-hidden px-4 py-2">
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 