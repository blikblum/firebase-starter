import {
  createColumnHelper,
  type CellData,
  type Column,
  type ColumnDef,
} from '@tanstack/react-table'
import { ArrowUpDownIcon } from 'lucide-react'
import type { Movie } from 'base/movies'

import type { DataTableFeatures } from '@/components/data-table-features'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { MovieLinkRenderer } from './movie-links'

interface CreateMovieTableColumnsOptions {
  getMovieHref: (movieId: string) => string
  renderLink: MovieLinkRenderer
}

const columnHelper = createColumnHelper<DataTableFeatures, Movie>()

export function createMovieTableColumns({
  getMovieHref,
  renderLink,
}: CreateMovieTableColumnsOptions): ColumnDef<DataTableFeatures, Movie>[] {
  return columnHelper.columns([
    columnHelper.accessor('title', {
      header: ({ column }) => renderSortableHeader(column, 'Title'),
      filterFn: 'includesString',
      sortFn: 'text',
      enableHiding: false,
    }),
    columnHelper.accessor('releaseYear', {
      id: 'year',
      header: ({ column }) => renderSortableHeader(column, 'Year'),
      cell: ({ row }) => row.original.releaseYear ?? '—',
      sortFn: 'basic',
      sortUndefined: 'last',
    }),
    columnHelper.accessor('director', {
      header: ({ column }) => renderSortableHeader(column, 'Director'),
      cell: ({ row }) => row.original.director ?? '—',
      sortFn: 'text',
      sortUndefined: 'last',
    }),
    columnHelper.accessor((movie) => movie.genres.join(', '), {
      id: 'genres',
      header: ({ column }) => renderSortableHeader(column, 'Genres'),
      cell: ({ row }) => row.original.genres.join(', ') || '—',
      sortFn: 'text',
    }),
    columnHelper.accessor('runtimeMinutes', {
      id: 'runtime',
      header: ({ column }) => renderSortableHeader(column, 'Runtime'),
      cell: ({ row }) => (row.original.runtimeMinutes ? `${row.original.runtimeMinutes} min` : '—'),
      sortFn: 'basic',
      sortUndefined: 'last',
    }),
    columnHelper.accessor('rating', {
      header: ({ column }) => renderSortableHeader(column, 'Rating'),
      cell: ({ row }) => row.original.rating ?? '—',
      sortFn: 'basic',
      sortUndefined: 'last',
    }),
    columnHelper.accessor('watched', {
      id: 'status',
      header: ({ column }) => renderSortableHeader(column, 'Status'),
      cell: ({ row }) => (
        <Badge variant={row.original.watched ? 'secondary' : 'outline'}>
          {row.original.watched ? 'Watched' : 'Unwatched'}
        </Badge>
      ),
      sortFn: 'basic',
    }),
    columnHelper.display({
      id: 'details',
      header: 'Details',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          render={renderLink({ to: getMovieHref(row.original.id) })}
        >
          View details
        </Button>
      ),
      enableHiding: false,
      enableSorting: false,
    }),
  ])
}

function renderSortableHeader<TValue extends CellData>(
  column: Column<DataTableFeatures, Movie, TValue>,
  title: string,
): React.JSX.Element {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {title}
      <ArrowUpDownIcon />
    </Button>
  )
}
