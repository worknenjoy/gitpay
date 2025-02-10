export const tableHeaderDefault = {
    "title": { sortable: true, numeric: false, dataBaseKey: "title", label: 'Issue' },
    "status": { sortable: true, numeric: false, dataBaseKey: "status", label: 'Status'},
    "project": { sortable: true, numeric: false, dataBaseKey: "Project.name", label: 'Project'},
    "value": { sortable: true, numeric: true, dataBaseKey: "value", label: 'Value'},
    "labels": { sortable: true, numeric: false, dataBaseKey: "Labels", label: 'Labels' },
    "languages": { sortable: true, numeric: false, dataBaseKey: "ProgrammingLanguage", label: 'Language'},
    "createdAt": { sortable: true, numeric: false, dataBaseKey: "createdAt", label: 'Created'},
  }
  
  export const tableHeaderWithProject = {
    "task.table.head.task": { sortable: true, numeric: false, dataBaseKey: "title", label: 'Issue' },
    "task.table.head.status": { sortable: true, numeric: false, dataBaseKey: "status", label: 'Status'},
    "task.table.head.value": { sortable: true, numeric: true, dataBaseKey: "value", label: 'Value'},
    "task.table.head.labels": { sortable: true, numeric: false, dataBaseKey: "Labels", label: 'Labels'},
    "task.table.head.languages": { sortable: true, numeric: false, dataBaseKey: "ProgrammingLanguage", label: 'Language'},
    "task.table.head.createdAt": { sortable: true, numeric: false, dataBaseKey: "createdAt", label: 'Created'},
  }