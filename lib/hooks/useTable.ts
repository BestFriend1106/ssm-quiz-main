import { ColumnDef, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'

type BaseTableProps<DataType> = {
  columns: ColumnDef<DataType>[]
  data: DataType[]
}

const useTable = <DataType = unknown>({ data, columns }: BaseTableProps<DataType>) => {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const table = useReactTable<DataType>({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    debugTable: true,
  })
  return { table, rowSelection, setRowSelection, globalFilter, setGlobalFilter }
}

export default useTable
