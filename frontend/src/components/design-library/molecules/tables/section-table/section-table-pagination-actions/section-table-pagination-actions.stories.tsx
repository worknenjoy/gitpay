import React from 'react'
import SectionTablePagination from './section-table-pagination-actions'

export default {
  title: 'Design Library/Molecules/Tables/SectionTable/Pagination',
  component: SectionTablePagination
}

const Template = (args) => <SectionTablePagination {...args} />

export const Default = Template.bind({})
Default.args = {
  currentPage: 1,
  totalPages: 10,
  onPageChange: (page) => console.log(`Page changed to: ${page}`)
}
