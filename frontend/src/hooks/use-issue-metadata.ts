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
  }
})

type UseIssueMetadataOptions = {
  includeProject?: boolean
}

const useIssueMetadata = (options: UseIssueMetadataOptions = {}) => {
  const intl = useIntl()
  const { includeProject = true } = options

  return React.useMemo(() => {
    const baseMetadata = {
      issue: {
        sortable: true,
        numeric: false,
        dataBaseKey: 'title',
        label: intl.formatMessage(messages.issue)
      },
      status: {
        sortable: true,
        numeric: false,
        dataBaseKey: 'description',
        label: intl.formatMessage(messages.status)
      },
      value: {
        sortable: true,
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
        numeric: false,
        dataBaseKey: 'createdAt',
        label: intl.formatMessage(messages.createdAt)
      }
    }

    if (!includeProject) {
      return baseMetadata
    }

    return {
      ...baseMetadata,
      project: {
        sortable: true,
        numeric: false,
        dataBaseKey: 'Project',
        label: intl.formatMessage(messages.project)
      }
    }
  }, [intl, includeProject])
}

export default useIssueMetadata
