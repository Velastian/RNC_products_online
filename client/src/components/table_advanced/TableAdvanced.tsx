import { useCallback, useMemo, useState } from "react";
import { Search, Settings, ChevronDown, Upload, Loader2Icon } from "lucide-react";

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

import { 
  Dialog, DialogClose, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "../ui/dialog";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../ui/table";

import { cn } from "@/lib/utils";
import { type Prediction } from "@/types";
import { columnNames, sizePages, getPaginationButton, getColumns, optionsImage  } from "./Item";
import { useImageUpload, usePredictions } from "@/hooks";

function TableAdvanced() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState(""); 

  const handleIsOpen = useCallback((value: boolean): void => {
    setIsOpen(value);
  }, []);

  const { 
    image, imagePreview, fileInputRef, 
    handleFileChange, handleChangeImageClick, handleRemoveImageClick 
  } = useImageUpload();

  const { data, loading, handleSubmit } = usePredictions({ 
    image, imagePreview, handleIsOpen 
  });

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
      <TableAdvancedHeader
        loading={loading}
        open={isOpen}
        setOpen={handleIsOpen}
        imagePreview={imagePreview}
        fileInputRef={fileInputRef}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        handleChangeImageClick={handleChangeImageClick}
        handleRemoveImageClick={handleRemoveImageClick}
      />

      <TableAdvancedFilters 
        globalFilter={globalFilter} 
        setGlobalFilter={setGlobalFilter} 
        table={table} 
      />

      <TableAdvancedBody table={table} columns={columns} />
      <TableAdvancedPagination table={table} />
      <TableAdvancedFooter table={table} data={data} />
    </div>
  )
};

interface TableAdvancedHeaderProps {
  loading: boolean;
  open: boolean;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setOpen: (value: boolean) => void;
  handleSubmit: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeImageClick: () => void;
  handleRemoveImageClick: () => void;
};

function TableAdvancedHeader(props: TableAdvancedHeaderProps) {
  const { 
    loading, imagePreview, fileInputRef, open, setOpen,
    handleSubmit, handleFileChange, handleChangeImageClick, handleRemoveImageClick 
  } = props;

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90">
        Predicciones de Objetos
      </h2>

      <TableAdvancedModal
        loading={loading}
        open={open}
        setOpen={setOpen}
        imagePreview={imagePreview}
        fileInputRef={fileInputRef}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        handleChangeImageClick={handleChangeImageClick}
        handleRemoveImageClick={handleRemoveImageClick}
      />
    </div>
  )
};

type TableAdvancedModalProps = TableAdvancedHeaderProps;

function TableAdvancedModal(props: TableAdvancedModalProps) {
  const { 
    loading, imagePreview, fileInputRef, open, handleSubmit, setOpen,
    handleFileChange, handleChangeImageClick, handleRemoveImageClick 
  } = props;

  const imageActions = optionsImage(handleChangeImageClick, handleRemoveImageClick);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="cursor-pointer">
          Agregar Predicción
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>IA Convolucional</DialogTitle>
          <DialogDescription>
            Favor de escoger la imagen que quiere analizar
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-0 w-full">
          <div 
            onClick={!imagePreview ? handleChangeImageClick : undefined} 
            className={cn(
              "flex flex-col items-center justify-center p-8 text-center",
              "rounded-md border-muted-foreground/25",
              !imagePreview ? (
                `border-dashed border-2 cursor-pointer hover:border-muted-foreground/50
                transition-colors`
              ) : ("border gap-4")
            )}
          >
            {!imagePreview ? (
              <>
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>

                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WebP o GIF (máx. 5MB)
                  </p>
                </div>
              </>
            ) : (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-md"
                />

                <div className="flex gap-2">
                  {imageActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      size="sm"
                      onClick={action.onClick}
                      className={action.className}
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </>
            )}

            <Input
              id="image-upload"
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button 
              className="cursor-pointer" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cerrar
            </Button>
          </DialogClose>
          <Button 
            className="cursor-pointer transition" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2Icon className="animate-spin" />
                Cargando...
              </>
            ): (
              "Analizar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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