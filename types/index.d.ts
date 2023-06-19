import { NextPage, NextComponentType, NextPageContext } from 'next/types'
import { FunctionComponent, ReactNode } from 'react'

export type PageAuth = {
  requireAdminAuth?: boolean
  requireUserAuth?: boolean
}

export type NextPageWithAuth<P = {}, IP = P> = NextPage<P, IP> & PageAuth
export type NextComponentWithAuth = NextComponentType<NextPageContext, any, {}> & Partial<NextPageWithAuth>

export type ComponentWithChildren = {
  children: React.ReactNode
}

export type IconComponent = FunctionComponent<ComponentProps<'svg'>>

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    isCentered?: boolean
    isTruncated?: boolean
    className?: string
    headClassName?: string
    cellClassName?: string
  }
}

export type WithoutID<T> = Omit<T, 'id'> & Partial<Pick<T, 'id'>>
