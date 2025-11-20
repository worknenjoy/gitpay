import React from 'react'
import TermsOfService from './terms-of-service'

export default {
  title: 'Design Library/Molecules/Content/Terms/TermsOfService',
  component: TermsOfService
}

const Template = (args) => <TermsOfService {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here if any
}

export const WithArrowBack = Template.bind({})
WithArrowBack.args = {
  onArrowBack: () => alert('Arrow back clicked')
}

export const WithAgreeButton = Template.bind({})
WithAgreeButton.args = {
  onAgreeTerms: () => alert('Agreed to Terms of Service')
}

export const WithBothActions = Template.bind({})
WithBothActions.args = {
  onArrowBack: () => alert('Arrow back clicked'),
  onAgreeTerms: () => alert('Agreed to Terms of Service')
}

export const WithoutExtraStyles = Template.bind({})
WithoutExtraStyles.args = {
  extraStyles: false
}
