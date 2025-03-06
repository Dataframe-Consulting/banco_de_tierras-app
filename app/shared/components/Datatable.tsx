"use client";

import { DatatableSkeleton } from "./Skeletons";
import DataTable from "react-data-table-component";
import { useEffect, useState, useMemo } from "react";
import type {
  TableStyles,
  TableColumn,
  ConditionalStyles,
  ExpanderComponentProps,
} from "react-data-table-component";

const themes = {
  minimalLight: {
    primary: "#F8F8FA", // Fondo de la tabla
    secondary: "#FFFFFF", // Filas alternas
    text: "#222222", // Texto oscuro para contraste
    accent: "#A0A0A0", // Bordes o detalles
    hover: "#E5E5E5", // Hover sobre filas
  },
  minimalDark: {
    primary: "#1E1E24", // Fondo de la tabla
    secondary: "#25252C", // Filas alternas
    text: "#E0E0E0", // Texto
    accent: "#A0A0A0", // Bordes o detalles
    hover: "#383842", // Hover sobre filas
  },
};

const getThemeColors = (theme: string) =>
  theme === "dark" ? themes.minimalDark : themes.minimalLight;

const customStyles = (theme: string): TableStyles => {
  const { primary, secondary, text, accent, hover } = getThemeColors(theme);
  return {
    headRow: {
      style: {
        backgroundColor: primary,
        color: text,
      },
    },
    rows: {
      style: {
        backgroundColor: secondary,
        color: text,
        "&:hover": {
          backgroundColor: hover,
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: primary,
        color: text,
      },
      pageButtonsStyle: {
        fill: accent,
        "&:hover:not(:disabled)": {
          fill: hover,
        },
      },
    },
  };
};

const Datatable = <T extends object>({
  data,
  columns,
  isExpandable = false,
  expandableRowsComponent,
  onSelectedRowsChange,
  conditionalRowStyles,
}: {
  data: T[];
  columns: TableColumn<T>[];
  isExpandable?: boolean;
  expandableRowsComponent?: React.FC<ExpanderComponentProps<T>>;
  onSelectedRowsChange?: (selected: { selectedRows: T[] }) => void;
  conditionalRowStyles?: (theme: string) => ConditionalStyles<T>[];
}) => {
  const theme = "light";
  const [isClient, setIsClient] = useState(false);

  const resolvedConditionalRowStyles = useMemo(
    () => conditionalRowStyles?.(theme),
    [theme, conditionalRowStyles]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    rangeSeparatorText: "de",
    selectAllRowsItemText: "Todo",
    rowsPerPageText: "Filas por página:",
  };

  if (!isClient) return <DatatableSkeleton />;

  return (
    <DataTable
      pagination
      fixedHeader
      data={data}
      columns={columns}
      paginationPerPage={50}
      expandableRows={isExpandable}
      customStyles={customStyles(theme)}
      onSelectedRowsChange={onSelectedRowsChange}
      paginationRowsPerPageOptions={[50, 100, 200]}
      expandableRowsComponent={expandableRowsComponent}
      conditionalRowStyles={resolvedConditionalRowStyles}
      selectableRows={onSelectedRowsChange ? true : false}
      paginationComponentOptions={paginationComponentOptions}
    />
  );
};

export default Datatable;
