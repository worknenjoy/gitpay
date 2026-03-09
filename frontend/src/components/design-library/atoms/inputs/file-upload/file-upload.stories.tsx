import type { Meta, StoryObj } from '@storybook/react'

import FileUpload, { FileUploadProps } from './file-upload'

const meta: Meta<FileUploadProps> = {
  title: 'Design Library/Atoms/Inputs/FileUpload',
  component: FileUpload,
  args: {
    name: 'attachments',
    multiple: true,
    completed: true
  }
}

export default meta

type Story = StoryObj<FileUploadProps>

export const Empty: Story = {}

export const Loading: Story = {
  args: {
    completed: false
  }
}

export const OneFile: Story = {
  args: {
    files: [new File(['hello'], 'invoice.pdf', { type: 'application/pdf' })]
  }
}

export const MultipleFiles: Story = {
  args: {
    files: [
      new File(['hello'], 'invoice.pdf', { type: 'application/pdf' }),
      new File(['data'], 'details.txt', { type: 'text/plain' }),
      new File(['img'], 'screenshot.png', { type: 'image/png' })
    ]
  }
}

export const EditExistingFiles: Story = {
  args: {
    existingFilesVersion: 3,
    existingFiles: [
      { id: '1', name: 'proposal.pdf', uploadedAt: '2026-03-01T10:00:00Z' },
      { id: '2', name: 'sow.docx', uploadedAt: '2026-03-04T17:45:00Z' },
      { id: '3', name: 'assets.zip', uploadedAt: '2026-03-05T09:15:00Z' }
    ]
  }
}

export const EditExistingAndNewFiles: Story = {
  args: {
    existingFilesVersion: 3,
    existingFiles: [
      { id: '1', name: 'proposal.pdf', uploadedAt: '2026-03-01T10:00:00Z' },
      { id: '2', name: 'sow.docx', uploadedAt: '2026-03-04T17:45:00Z' }
    ],
    appendOnSelect: true,
    files: [new File(['hello'], 'additional-notes.txt', { type: 'text/plain' })]
  }
}

export const EditDuplicateConfirm: Story = {
  args: {
    existingFilesVersion: 3,
    existingFiles: [
      { id: '1', name: 'proposal.pdf', uploadedAt: '2026-03-01T10:00:00Z' },
      { id: '2', name: 'sow.docx', uploadedAt: '2026-03-04T17:45:00Z' }
    ],
    appendOnSelect: true,
    confirmOnDuplicate: true
  }
}
