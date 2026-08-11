import * as React from 'react'
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
} from '@tanstack/react-table'
import { Columns3Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { dataTableFeatures, type DataTableFeatures } from './data-table-features'

export interface DataTableSearch {
  columnId: string
  placeholder?: string
}

export interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  search?: DataTableSearch
  showColumnToggle?: boolean
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  search,
  showColumnToggle = false,
}: DataTableProps<TData>): React.JSX.Element {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({})

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const searchColumn = search ? table.getColumn(search.columnId) : undefined
  const hideableColumns = table.getAllColumns().filter((column) => column.getCanHide())
  const hasToolbar = Boolean(search || (showColumnToggle && hideableColumns.length))

  return (
    <div>
      {hasToolbar ? (
        <div className="flex items-center gap-2 py-4">
          {search ? (
            <Input
              className="max-w-sm"
              aria-label={search.placeholder ?? 'Search table'}
              type="search"
              placeholder={search.placeholder ?? 'Search...'}
              value={(searchColumn?.getFilterValue() as string | undefined) ?? ''}
              onChange={(event) => searchColumn?.setFilterValue(event.target.value)}
            />
          ) : null}

          {showColumnToggle && hideableColumns.length ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-auto" render={<Button variant="outline" />}>
                <Columns3Icon />
                Columns
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {hideableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(checked) => column.toggleVisibility(checked)}
                  >
                    {getColumnLabel(column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={Math.max(table.getVisibleLeafColumns().length, 1)}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2 py-4">
        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function getColumnLabel(columnId: string): string {
  return columnId
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/^./, (character) => character.toUpperCase())
}
