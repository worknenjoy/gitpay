import React from 'react'

import IssueLanguageField from './issue-language-field'

export default {
  title: 'Design Library/Molecules/Tables/Fields/Issue/IssueLanguageField',
  component: IssueLanguageField,
}

const Template = (args) => <IssueLanguageField {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  issue: {
    Project: {
      ProgrammingLanguages: [
        {
          id: 1,
          name: 'Language 1',
        },
        {
          id: 2,
          name: 'Language 2',
        },
      ],
    },
  },
}
