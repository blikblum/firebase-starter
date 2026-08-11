import type { Meta, StoryObj } from '@storybook/react-vite'
import { createColumnHelper } from '@tanstack/react-table'
import { ArrowUpDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { DataTable } from './data-table'
import type { DataTableFeatures } from './data-table-features'

interface Person {
  id: string
  name: string
  email: string
  visits: number
}

const people: Person[] = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: `Person ${index + 1}`,
  email: `person${index + 1}@example.com`,
  visits: (index + 1) * 3,
}))

const columnHelper = createColumnHelper<DataTableFeatures, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
        <ArrowUpDownIcon />
      </Button>
    ),
    filterFn: 'includesString',
    sortFn: 'text',
    enableHiding: false,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    filterFn: 'includesString',
    sortFn: 'text',
  }),
  columnHelper.accessor('visits', {
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Visits
        <ArrowUpDownIcon />
      </Button>
    ),
    sortFn: 'basic',
  }),
])

const meta = {
  title: 'Components/DataTable',
  component: DataTable<Person>,
  args: {
    columns,
    data: people,
    search: {
      columnId: 'email',
      placeholder: 'Filter emails...',
    },
    showColumnToggle: true,
  },
} satisfies Meta<typeof DataTable<Person>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutOptionalControls: Story = {
  args: {
    search: undefined,
    showColumnToggle: false,
  },
}

export const Empty: Story = {
  args: {
    data: [],
  },
}
