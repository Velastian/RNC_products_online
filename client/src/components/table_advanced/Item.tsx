import { type ReactNode } from "react";
import { type Table, type Column, type ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  ArrowUp, ArrowDown, ArrowUpDown, 
  Upload,
  X
} from "lucide-react";

import { type Prediction } from "@/types";
import { Button } from "../ui/button";

export const headerToOrderTable = <T extends keyof Prediction>(
  title: string, column: Column<Prediction, Prediction[T]>
) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {title}

      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
};

const columnHelper = createColumnHelper<Prediction>();

export const getColumns = [
  columnHelper.accessor("id", {
    header: ({ column }) => headerToOrderTable("ID", column),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("imagen", {
    header: "Imagen",
    cell: (info) => (
      <div className="flex justify-center">
        <img
          src={info.getValue() || "/placeholder.svg"}
          alt="Predicción"
          className="h-10 w-10 rounded-full border object-cover"
        />
      </div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("bicycle", {
    header: ({ column }) => headerToOrderTable("Bicicleta", column),
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("cabinet", {
    header: ({ column }) => headerToOrderTable("Gabinete", column),
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("chair", {
    header: ({ column }) => headerToOrderTable("Silla", column),
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("coffeMaker", {
    header: ({ column }) => headerToOrderTable("Cafetera", column),
    cell: (info) => `${`${info.getValue()} %`} %`,
  }),
  columnHelper.accessor("fan", {
    header: ({ column }) => headerToOrderTable("Ventilador", column),
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("kettle", {
    header: ({ column }) => headerToOrderTable("Tetera", column),
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("lamp", {
    header: ({ column }) => headerToOrderTable("Lámpara", column),
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("mug", {
    header: ({ column }) => headerToOrderTable("Taza", column),
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("sofa", {
    header: ({ column }) => headerToOrderTable("Sofá", column),
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("stapler", {
    header: ({ column }) => headerToOrderTable("Grapadora", column),
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("table", {
    header: ({ column }) => headerToOrderTable("Mesa", column),
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("toaster", {
    header: ({ column }) => headerToOrderTable("Tostadora", column),
    cell: (info) => `${info.getValue()} %`,
  }),
] as ColumnDef<Prediction>[];

export type ImageOptions = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
  className: string;
};

export const optionsImage = (
  handleChangeImageClick: () => void, 
  handleRemoveImageClick: () => void
): ImageOptions[] => {
  return [
    {
      label: "Cambiar imagen",
      icon: <Upload className="h-4 w-4 mr-2" />,
      onClick: handleChangeImageClick,
      variant: "outline",
      className: "flex-1 cursor-pointer",
    },
    {
      label: "Eliminar",
      icon: <X  className="h-4 w-4 mr-2" />,
      onClick: handleRemoveImageClick,
      variant: "destructive",
      className: "cursor-pointer"
    }
  ]
};

interface PaginationButton {
  onClick: () => void;
  disabled: boolean;
  icon: ReactNode;
  label: string;
  hideOnSmall?: boolean;
};

export const columnNames: Record<string, string> = {
  id: "ID",
  imagen: "Imagen",
  bicycle: "Bicicleta",
  cabinet: "Gabinete",
  chair: "Silla",
  coffeMaker: "Cafetera",
  fan: "Ventilador",
  kettle: "Tetera",
  lamp: "Lámpara",
  mug: "Taza",
  sofa: "Sofá",
  stapler: "Grapadora",
  table: "Mesa",
  toaster: "Tostadora",
  actions: "Acciones",
};

export const sizePages = [5, 10, 20, 30, 40, 50];

export const getPaginationButton = (table: Table<Prediction>): PaginationButton[] => {
  return [
    {
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      icon: <ChevronsLeft className="h-4 w-4" />,
      label: "Ir a la primera página",
      hideOnSmall: true,
    },
    {
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      icon: <ChevronLeft className="h-4 w-4" />,
      label: "Ir a la página anterior",
    },
    {
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      icon: <ChevronRight className="h-4 w-4" />,
      label: "Ir a la página siguiente",
    },
    {
      onClick: () => table.setPageIndex(table.getPageCount() - 1),
      disabled: !table.getCanNextPage(),
      icon: <ChevronsRight className="h-4 w-4" />,
      label: "Ir a la última página",
      hideOnSmall: true,
    }
  ]
};