import React from 'react'
import { defineMessages, useIntl } from 'react-intl'

const messages = defineMessages({
  issue: {
    id: 'table.header.issue',
    defaultMessage: 'issue'
  },
  status: {
    id: 'table.header.status',
    defaultMessage: 'Status'
  },
  project: {
    id: 'table.header.project',
    defaultMessage: 'Project'
  },
  amount: {
    id: 'table.header.amount',
    defaultMessage: 'Amount'
  },
  labels: {
    id: 'table.header.labels',
    defaultMessage: 'Labels'
  },
  languages: {
    id: 'table.header.languages',
    defaultMessage: 'Languages'
  },
  createdAt: {
    id: 'table.header.createdAt',
    defaultMessage: 'Created at'
  },
  actions: {
    id: 'table.header.actions',
    defaultMessage: 'Actions'
  }
})

type UseIssueMetadataOptions = {
  includeProject?: boolean
  /** Appends a non-sortable, unlabeled "actions" column (row-actions dropdown) */
  includeActions?: boolean
}

const useIssueMetadata = (options: UseIssueMetadataOptions = {}) => {
  const intl = useIntl()
  const { includeProject = true, includeActions = false } = options

  return React.useMemo(() => {
    const baseMetadata = {
      issue: {
        sortable: true,
        serverSortKey: 'title',
        numeric: false,
        dataBaseKey: 'title',
        label: intl.formatMessage(messages.issue)
      },
      status: {
        sortable: true,
        serverSortKey: 'status',
        numeric: false,
        dataBaseKey: 'description',
        label: intl.formatMessage(messages.status)
      },
      value: {
        sortable: true,
        serverSortKey: 'value',
        numeric: true,
        dataBaseKey: 'value',
        label: intl.formatMessage(messages.amount)
      },
      labels: {
        sortable: true,
        numeric: false,
        dataBaseKey: 'Labels',
        label: intl.formatMessage(messages.labels)
      },
      languages: {
        sortable: true,
        numeric: false,
        dataBaseKey: 'ProgrammingLanguage',
        label: intl.formatMessage(messages.languages)
      },
      createdAt: {
        sortable: true,
        serverSortKey: 'createdAt',
        numeric: false,
        dataBaseKey: 'createdAt',
        label: intl.formatMessage(messages.createdAt)
      }
    }

    const withProject = includeProject
      ? {
          ...baseMetadata,
          project: {
            sortable: true,
            numeric: false,
            dataBaseKey: 'Project',
            label: intl.formatMessage(messages.project)
          }
        }
      : baseMetadata

    if (!includeActions) {
      return withProject
    }

    return {
      ...withProject,
      actions: {
        sortable: false,
        numeric: false,
        dataBaseKey: 'id',
        label: intl.formatMessage(messages.actions)
      }
    }
  }, [intl, includeProject, includeActions])
}

export default useIssueMetadata
