import { type CardProps } from "./card"

export type TableTabsContentProps = {
  tableData: {
    completed: boolean
    data: Array<any>
  }
  tableHeaderMetadata: any
  customColumnRenderer?: { [key: string]: (value: any, rowData: any) => React.ReactNode }
}

export type TableTabsProps = {
  label: React.ReactNode
  value: string
  table: TableTabsContentProps
  cards?: Array<CardProps>
}