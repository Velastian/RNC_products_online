import { useMemo, useState } from "react";
import { Search, Settings, ChevronDown } from "lucide-react";

import { 
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ColumnDef,
  type Table as TableType,
} from "@tanstack/react-table";

import { 
  DropdownMenu, DropdownMenuTrigger, 
  DropdownMenuContent, DropdownMenuCheckboxItem 
} from "../ui/dropdown-menu";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../ui/table";

import { cn } from "@/lib/utils";
import { type Prediction } from "@/types";
import { columnNames, sizePages, getPaginationButton, getColumns  } from "./Item";

const datosExample: Prediction[] = [
  {
    id: "PRED-001",
    imagen: "/placeholder.svg?height=40&width=40",
    bicycle: 0,
    cabinet: 0.12,
    chair: 0.95,
    coffeMaker: 0.78,
    fan: 0.34,
    kettle: 0.67,
    lamp: 0.89,
    mug: 0.45,
    sofa: 0.92,
    stapler: 0.23,
    table: 0.88,
    toaster: 0.56,
  },
  {
    id: "PRED-002",
    imagen: "/placeholder.svg?height=40&width=40",
    bicycle: 0.23,
    cabinet: 0.87,
    chair: 0.45,
    coffeMaker: 0.91,
    fan: 0.78,
    kettle: 0.34,
    lamp: 0.67,
    mug: 0.89,
    sofa: 0.12,
    stapler: 0.95,
    table: 0.56,
    toaster: 0.78,
  },
  {
    id: "PRED-003",
    imagen: "/placeholder.svg?height=40&width=40",
    bicycle: 0.67,
    cabinet: 0.45,
    chair: 0.78,
    coffeMaker: 0.23,
    fan: 0.91,
    kettle: 0.89,
    lamp: 0.34,
    mug: 0.67,
    sofa: 0.85,
    stapler: 0.12,
    table: 0.95,
    toaster: 0.45,
  },
  {
    id: "PRED-004",
    imagen: "/placeholder.svg?height=40&width=40",
    bicycle: 0.91,
    cabinet: 0.78,
    chair: 0.23,
    coffeMaker: 0.67,
    fan: 0.45,
    kettle: 0.95,
    lamp: 0.12,
    mug: 0.89,
    sofa: 0.34,
    stapler: 0.78,
    table: 0.67,
    toaster: 0.91,
  },
  {
    id: "PRED-005",
    imagen: "/placeholder.svg?height=40&width=40",
    bicycle: 0.34,
    cabinet: 0.91,
    chair: 0.67,
    coffeMaker: 0.45,
    fan: 0.89,
    kettle: 0.23,
    lamp: 0.78,
    mug: 0.95,
    sofa: 0.67,
    stapler: 0.34,
    table: 0.12,
    toaster: 0.85,
  },
  {
    id: "PRED-006",
    imagen: "/placeholder.svg?height=40&width=40",
    bicycle: 0.78,
    cabinet: 0.34,
    chair: 0.91,
    coffeMaker: 0.89,
    fan: 0.12,
    kettle: 0.78,
    lamp: 0.95,
    mug: 0.23,
    sofa: 0.45,
    stapler: 0.67,
    table: 0.89,
    toaster: 0.34,
  },
  {
    id: "PRED-007",
    imagen: "/placeholder.svg?height=40&width=40",
    bicycle: 0.45,
    cabinet: 0.67,
    chair: 0.34,
    coffeMaker: 0.95,
    fan: 0.23,
    kettle: 0.91,
    lamp: 0.78,
    mug: 0.12,
    sofa: 0.89,
    stapler: 0.45,
    table: 0.34,
    toaster: 0.67,
  },
  {
    id: "PRED-008",
    imagen: "/placeholder.svg?height=40&width=40",
    bicycle: 0.89,
    cabinet: 0.23,
    chair: 0.78,
    coffeMaker: 0.34,
    fan: 0.67,
    kettle: 0.45,
    lamp: 0.91,
    mug: 0.78,
    sofa: 0.23,
    stapler: 0.89,
    table: 0.95,
    toaster: 0.12,
  },
];

function TableAdvanced() {
  const [data] = useState<Prediction[]>(datosExample);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(() => {
    return getColumns
  }, []);

  const filteredData = useMemo(() => {
    return data
  }, [data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="w-full space-y-4">
      <TableAdvancedHeader />
      <TableAdvancedFilters globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} table={table} />
      <TableAdvancedBody table={table} columns={columns} />
      <TableAdvancedPagination table={table} />
      <TableAdvancedFooter table={table} data={data} />
    </div>
  )
};

function TableAdvancedHeader() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90">
        Predicciones de Objetos
      </h2>

      <Button>Agregar Predicción</Button>
    </div>
  )
};

interface TableAdvancedFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  table: TableType<Prediction>;
};

function TableAdvancedFilters(props: TableAdvancedFiltersProps) {
  const { globalFilter, setGlobalFilter, table } = props;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <Input
            placeholder="Buscar predicciones..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings className="mr-2 h-4 w-4" />
              Columnas
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnNames[column.id] || column.id}
                </DropdownMenuCheckboxItem>
              ))
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
};

type TableAdvancedBodyProps = Pick<TableAdvancedFiltersProps, "table"> & {
  columns: ColumnDef<Prediction>[];
};

function TableAdvancedBody({ table, columns }: TableAdvancedBodyProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-medium">
                  {header.isPlaceholder 
                    ? null 
                    : flexRender(header.column.columnDef.header, header.getContext())
                  }
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow 
                key={row.id} 
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id} 
                    className="text-sm text-center font-mono text-gray-700 dark:text-white/80"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
};

type TableAdvancedPaginationProps = Pick<TableAdvancedFiltersProps, "table">;

function TableAdvancedPagination({ table }: TableAdvancedPaginationProps) {
  const paginationButtons = getPaginationButton(table);

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium dark:text-white/90">
          Filas por página
        </p>

        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {sizePages.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <span className="text-sm font-medium dark:text-white/90">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>

        <div className="flex items-center space-x-2">
          {paginationButtons.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                "h-8 w-8 p-0",
                item.hideOnSmall && "hidden lg:flex"
              )}
            >
              <span className="sr-only">{item.label}</span>
              {item.icon}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
};

type TableAdvancedFooterProps = Pick<TableAdvancedFiltersProps, "table"> & {
  data: Prediction[];
};

function TableAdvancedFooter({ table, data }: TableAdvancedFooterProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500">
      <span className="dark:text-white/70">
        Mostrando {table.getRowModel().rows.length} de {table.getFilteredRowModel().rows.length} resultados
      </span>

      <span className="dark:text-white/70">
        {table.getFilteredRowModel().rows.length} de {data.length} predicciones totales
      </span>
    </div>
  )
};

export default TableAdvanced;