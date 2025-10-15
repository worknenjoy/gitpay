import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { issueMetadata, customColumnRenderer } from 'design-library/molecules/tables/project-issue-table/project-issue-table'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import {
  Container
} from '@mui/material'
import {
  ExplorePaper,
  TopSection
} from './my-project-issues-private-page.styles'
import Breadcrumbs from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb';
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import useUserTypes from '../../../../../../hooks/use-user-types'
import ContextTitle from 'design-library/atoms/typography/context-title/context-title'


const MyProjectIssuesPrivatePage = ({ 
  project,
  user,
  issues 
}) => {
  const history = useHistory()
  const { project_id, organization_id } = useParams<{ project_id: string, organization_id: string }>()
  const { filter } = useParams<{ filter: string }>()
  const { isContributor, isMaintainer } = useUserTypes({ user })
  const [ activeTab, setActiveTab ] = React.useState('createdbyme')

  const issueTableData = {
    tableData: issues,
    tableHeaderMetadata: issueMetadata,
    customColumnRenderer: customColumnRenderer
  }

  const baseLink = `/profile/organizations/${organization_id}/projects/${project_id}`

  const myIssuesTab = {
    label: 'My imported issues',
    value: 'createdbyme',
    link: `${baseLink}/createdbyme`,
    table: issueTableData
  }

  const workingTabs = {
    label: 'Issues I\'m working on',
    value: 'assigned',
    link: `${baseLink}/assigned`,
    table: issueTableData
  }

  const followingTabs = {
    label: 'Following',
    value: 'interested',
    link: `${baseLink}/interested`,
    table: issueTableData
  }

  const currentTabs = [
    ...(isMaintainer ? [myIssuesTab] : []),
    ...(isContributor ? [workingTabs, followingTabs] : [])
  ]

  React.useEffect(() => {
    if(filter) {
      setActiveTab(filter)
      return
    }
    const currentFirstTabByRole = isMaintainer ? 'createdbyme' : isContributor ? 'assigned' : 'createdbyme'
    history.push(`${baseLink}/${currentFirstTabByRole}`)
    setActiveTab(currentFirstTabByRole)
  }, [isContributor, isMaintainer, filter])

  return (
    <ExplorePaper elevation={0}>
      <Container>
        <TopSection>
          <Breadcrumbs project={project} />
        </TopSection>
        <TopSection>
          <MainTitle
            title="My Issues"
            subtitle="Here you can see issues imported or that you're working on"
          />
        </TopSection>
        <TopSection>
          <ContextTitle
            context={project}
            title={<FormattedMessage id="projects.explore.project.issues" defaultMessage="Project" />}
          />
        </TopSection>
        <TopSection>
          <TabbedTable
            tabs={currentTabs}
            activeTab={activeTab}
          />
        </TopSection>
      </Container>
    </ExplorePaper>
  )
}

export default MyProjectIssuesPrivatePage