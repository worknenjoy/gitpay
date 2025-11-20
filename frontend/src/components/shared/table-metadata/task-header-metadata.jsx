export const tableHeaderDefault = {
  title: { sortable: true, numeric: false, dataBaseKey: 'title', label: 'Issue' },
  status: { sortable: true, numeric: false, dataBaseKey: 'status', label: 'Status' },
  project: { sortable: true, numeric: false, dataBaseKey: 'Project.name', label: 'Project' },
  value: { sortable: true, numeric: true, dataBaseKey: 'value', label: 'Value' },
  labels: { sortable: true, numeric: false, dataBaseKey: 'Labels', label: 'Labels' },
  languages: {
    sortable: true,
    numeric: false,
    dataBaseKey: 'ProgrammingLanguage',
    label: 'Language',
  },
  createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: 'Created' },
}

export const tableHeaderWithProject = {
  title: { sortable: true, numeric: false, dataBaseKey: 'title', label: 'Issue' },
  status: { sortable: true, numeric: false, dataBaseKey: 'status', label: 'Status' },
  value: { sortable: true, numeric: true, dataBaseKey: 'value', label: 'Value' },
  labels: { sortable: true, numeric: false, dataBaseKey: 'Labels', label: 'Labels' },
  languages: {
    sortable: true,
    numeric: false,
    dataBaseKey: 'ProgrammingLanguage',
    label: 'Language',
  },
  createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: 'Created' },
}
