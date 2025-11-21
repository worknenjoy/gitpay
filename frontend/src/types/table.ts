export type TableTabsContentProps = {
  tableData: {
    completed: boolean
    data: Array<any>
  }
  tableHeaderMetadata: any
  customColumnRenderer?: { [key: string]: (value: any, rowData: any) => React.ReactNode }
}

export type TableTabsProps = Array<{
  label: React.ReactNode
  value: string
  table: TableTabsContentProps
  cards?: Array<{
    title: string | React.ReactNode
    amount: number
    type: 'decimal' | 'centavos'
  }>
}>
