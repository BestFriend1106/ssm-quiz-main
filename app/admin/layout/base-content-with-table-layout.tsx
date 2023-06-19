import { useMemo } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ColumnDef } from '@tanstack/react-table'
import useTable from 'lib/hooks/useTable'
import ActionButton from 'shared/button/action'
import LoadingSpinner from 'shared/icon/loading-spinner'
import TextInput from 'shared/input/text-input'
import BaseTable from 'shared/tables/base-table'

const SHOW_PAGINATION = false

type BaseContentWithTableLayoutProps<T> = {
  data: T[]
  tableColumns: ColumnDef<T>[]
  isLoading?: boolean
  noDataText?: string
  onOpenDataInfo?(data?: T): void
  displaySearch?: boolean
}

const BaseContentWithTableLayout = <T extends unknown>({
  data,
  tableColumns,
  isLoading,
  onOpenDataInfo,
  noDataText = 'Nessun dato disponibile',
  displaySearch = true,
}: BaseContentWithTableLayoutProps<T>) => {
  const columns = useMemo(() => tableColumns, [])
  const { table, globalFilter, setGlobalFilter } = useTable<T>({
    data,
    columns,
  })

  return (
    <div className="w-full h-full">
      {displaySearch && (
        <div className="sticky top-0 flex items-center justify-between p-4 bg-white border border-collapse rounded-2xl border-slate-200">
          <TextInput
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
            className="w-1/2"
            inputClassName="py-1 shadow-none border rounded-full font-lg border-block"
            placeholder="Cerca in tutte le colonne..."
          />
          <ActionButton className="min-w-0 w-fit" onClick={() => onOpenDataInfo?.()}>
            <PlusIcon className="w-5 h-5" />
          </ActionButton>
        </div>
      )}
      <div className="mt-2 overflow-scroll bg-white border-4 border-collapse rounded-2xl mb-28 border-slate-200">
        <BaseTable<T> table={table} />
        {data.length === 0 && (
          <div className="grid p-2 place-items-center">{isLoading ? <LoadingSpinner size={12} /> : noDataText}</div>
        )}
        {SHOW_PAGINATION && (
          <div className="flex items-center gap-2 mt-2">
            <button
              className="p-1 border rounded"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="p-1 border rounded"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button className="p-1 border rounded" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {'>'}
            </button>
            <button
              className="p-1 border rounded"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="w-16 p-1 border rounded"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

export default BaseContentWithTableLayout
