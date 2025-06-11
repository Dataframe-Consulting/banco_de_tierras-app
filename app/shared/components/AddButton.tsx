import React from "react";
import { PlusCircle } from "@/app/shared/icons";

interface IAddButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

/**
 * Botón de añadir elemento con texto descriptivo
 * 
 * Parámetros
 * ----------
 * label : string
 *     Texto que describe qué se va a añadir (ej: "Añadir Renta")
 * onClick : function
 *     Función que se ejecuta al hacer clic
 * className : string, opcional
 *     Clases CSS adicionales
 * 
 * Retorna
 * -------
 * JSX.Element
 *     Botón con ícono y texto descriptivo
 */
const AddButton: React.FC<IAddButtonProps> = ({ 
  label, 
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors ${className}`}
    >
      <PlusCircle />
      {label}
    </button>
  );
};

export default AddButton; 