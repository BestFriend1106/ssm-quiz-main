import { twMerge } from 'tailwind-merge'
import { Cell, flexRender, Header, Table as ReactTable } from '@tanstack/react-table'

type BaseTableProps<DataType> = {
  table: ReactTable<DataType>
}

const BaseTable = <DataType,>({ table }: BaseTableProps<DataType>) => {
  return (
    <table className="w-full text-xs">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className="my-2 text-sm leading-normal text-left uppercase border-b bg-slate-200" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return <HeadCell<DataType> key={header.id} header={header} />
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, index, rows) => {
          const isOddRow = index % 2 === 0
          const isLastRow = index === rows.length - 1
          return (
            <tr
              className={twMerge(
                'border-b hover:bg-gray-100 text-slate-500',
                isOddRow ? 'bg-gray-50' : 'bg-white',
                isLastRow && 'rounded-b-full, border-b-0'
              )}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => {
                return <BodyCell<DataType> key={cell.id} cell={cell} />
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const HeadCell = <DataType,>({ header }: { header: Header<DataType, unknown> }) => {
  const headerInfo = header.column.columnDef.meta ?? {}
  return (
    <th
      className={twMerge(
        'py-2 font-medium text-slate-500',
        headerInfo.isCentered ? 'text-center' : 'text-left px-1',
        headerInfo.className,
        headerInfo.headClassName
      )}
      key={header.id}
      colSpan={header.colSpan}
    >
      {header.isPlaceholder ? null : <>{flexRender(header.column.columnDef.header, header.getContext())}</>}
    </th>
  )
}

const BodyCell = <DataType,>({ cell }: { cell: Cell<DataType, unknown> }) => {
  const cellInfo = cell.column.columnDef.meta ?? {}
  return (
    <td
      className={twMerge(
        'py-[0.375rem] px-1 min-w-0',
        cellInfo.isCentered ? 'text-center' : 'text-left',
        cellInfo.isTruncated && 'max-w-[10rem] truncate',
        cellInfo.className,
        cellInfo.cellClassName
      )}
      key={cell.id}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  )
}

export default BaseTable
