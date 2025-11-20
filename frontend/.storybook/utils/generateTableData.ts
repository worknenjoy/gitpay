type TableRow = {
  id: number
  name: string
  email: string
  role: string
  status: string
  action: string
  other: string
}

export const generateTableData = (count: number): TableRow[] => {
  const data: TableRow[] = []
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      name: `John Doe ${i + 1}`,
      email: `john${i}@gmail.com`,
      role: 'Contributor',
      status: 'Active',
      action: 'Edit',
      other: 'Other',
    })
  }
  return data
}
