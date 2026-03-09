import React, { useMemo, useRef, useState } from 'react'
import { Box, IconButton, Paper, Skeleton, Typography } from '@mui/material'
import {
  InsertDriveFileOutlined,
  PictureAsPdfOutlined,
  ImageOutlined,
  DescriptionOutlined,
  ArchiveOutlined,
  Close as CloseIcon
} from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import Button from 'design-library/atoms/buttons/button/button'
import ConfirmDialog from 'design-library/molecules/dialogs/confirm-dialog/confirm-dialog'

export type ExistingUploadedFile = {
  id?: string | number
  name: string
  size?: number
  version?: string | number
  uploadedAt?: string | Date
}

export type FileUploadProps = {
  name: string
  multiple?: boolean
  accept?: string
  completed?: boolean
  disabled?: boolean
  files?: File[]
  existingFiles?: ExistingUploadedFile[]
  existingFilesVersion?: string | number
  appendOnSelect?: boolean
  confirmOnDuplicate?: boolean
  onFilesChange?: (files: File[]) => void
}

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
  const value = bytes / Math.pow(k, i)
  return `${value.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`
}

const getFileIcon = (file: File) => {
  const type = (file.type || '').toLowerCase()
  const name = (file.name || '').toLowerCase()
  const ext = name.includes('.') ? name.split('.').pop() || '' : ''

  const isPdf = type === 'application/pdf' || ext === 'pdf'
  const isImage =
    type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)
  const isText =
    type.startsWith('text/') ||
    ['txt', 'md', 'csv', 'log', 'json', 'xml', 'yaml', 'yml'].includes(ext)
  const isArchive =
    ['zip', 'rar', '7z', 'tar', 'gz', 'tgz'].includes(ext) ||
    [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'application/gzip'
    ].includes(type)

  if (isPdf) return <PictureAsPdfOutlined fontSize="small" color="action" />
  if (isImage) return <ImageOutlined fontSize="small" color="action" />
  if (isArchive) return <ArchiveOutlined fontSize="small" color="action" />
  if (isText) return <DescriptionOutlined fontSize="small" color="action" />
  return <InsertDriveFileOutlined fontSize="small" color="action" />
}

const getExistingFileIcon = (file: ExistingUploadedFile) => {
  const name = (file.name || '').toLowerCase()
  const ext = name.includes('.') ? name.split('.').pop() || '' : ''

  const isPdf = ext === 'pdf'
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)
  const isText = ['txt', 'md', 'csv', 'log', 'json', 'xml', 'yaml', 'yml'].includes(ext)
  const isArchive = ['zip', 'rar', '7z', 'tar', 'gz', 'tgz'].includes(ext)

  if (isPdf) return <PictureAsPdfOutlined fontSize="small" color="action" />
  if (isImage) return <ImageOutlined fontSize="small" color="action" />
  if (isArchive) return <ArchiveOutlined fontSize="small" color="action" />
  if (isText) return <DescriptionOutlined fontSize="small" color="action" />
  return <InsertDriveFileOutlined fontSize="small" color="action" />
}

const formatUploadedAt = (value?: string | Date) => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(date)
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  multiple = true,
  accept,
  completed = true,
  disabled,
  files,
  existingFiles = [],
  existingFilesVersion,
  appendOnSelect = false,
  confirmOnDuplicate = true,
  onFilesChange
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [internalFiles, setInternalFiles] = useState<File[]>([])

  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false)
  const [pendingPickedFiles, setPendingPickedFiles] = useState<File[]>([])
  const [duplicateNames, setDuplicateNames] = useState<string[]>([])

  const isControlled = files !== undefined

  const displayFiles = files ?? internalFiles

  const isDisabled = !completed || !!disabled

  const setFiles = (nextFiles: File[]) => {
    if (!isControlled) {
      setInternalFiles(nextFiles)
    }
    onFilesChange?.(nextFiles)
  }

  const buttonLabel = useMemo(() => {
    if (multiple) {
      return <FormattedMessage id="fileUpload.chooseFiles" defaultMessage="Choose files" />
    }
    return <FormattedMessage id="fileUpload.chooseFile" defaultMessage="Choose file" />
  }, [multiple])

  const handleOpenPicker = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    inputRef.current?.click()
  }

  const handleFilesSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const pickedFiles = Array.from(e.target.files || [])
    const normalizedPicked = pickedFiles.map((f) => f.name.toLowerCase())

    const existingNames = new Set(existingFiles.map((f) => (f.name || '').toLowerCase()))
    const currentNames = new Set(displayFiles.map((f) => (f.name || '').toLowerCase()))
    const duplicates = Array.from(
      new Set(
        normalizedPicked
          .filter((name) => existingNames.has(name) || currentNames.has(name))
          .map((n) => n)
      )
    )

    if (confirmOnDuplicate && duplicates.length > 0) {
      setPendingPickedFiles(pickedFiles)
      setDuplicateNames(duplicates)
      setDuplicateDialogOpen(true)
      return
    }

    const picked = pickedFiles
    if (!multiple) {
      setFiles(picked.slice(0, 1))
      return
    }

    const nextFiles = appendOnSelect ? [...displayFiles, ...picked] : picked
    setFiles(nextFiles)
  }

  const applyPendingPickedFiles = (mode: 'overwrite' | 'skip') => {
    const normalize = (value: string) => value.toLowerCase()

    const existingNames = new Set(existingFiles.map((f) => (f.name || '').toLowerCase()))
    const currentNames = new Set(displayFiles.map((f) => (f.name || '').toLowerCase()))

    const pickedFiles = pendingPickedFiles
    const pickedNames = new Set(pickedFiles.map((f) => normalize(f.name || '')))

    const filteredPicked =
      mode === 'skip'
        ? pickedFiles.filter((f) => {
            const n = normalize(f.name || '')
            return !existingNames.has(n) && !currentNames.has(n)
          })
        : pickedFiles

    if (!multiple) {
      setFiles(filteredPicked.slice(0, 1))
      return
    }

    if (!appendOnSelect) {
      setFiles(filteredPicked)
      return
    }

    const base =
      mode === 'overwrite'
        ? displayFiles.filter((f) => !pickedNames.has(normalize(f.name || '')))
        : displayFiles

    setFiles([...base, ...filteredPicked])
  }

  const handleCloseDuplicateDialog = () => {
    setDuplicateDialogOpen(false)
    setPendingPickedFiles([])
    setDuplicateNames([])
  }

  const handleRemoveFile = (indexToRemove: number) => {
    const nextFiles = displayFiles.filter((_, index) => index !== indexToRemove)
    setFiles(nextFiles)
  }

  if (!completed) {
    return <Skeleton variant="rectangular" animation="wave" width="100%" height={120} />
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        bgcolor: 'background.paper',
        p: 2,
        borderStyle: 'dashed'
      }}
    >
      <ConfirmDialog
        open={duplicateDialogOpen}
        handleClose={handleCloseDuplicateDialog}
        completed={completed}
        message={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              <FormattedMessage
                id="fileUpload.duplicate.title"
                defaultMessage="Some files already exist"
              />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage
                id="fileUpload.duplicate.message"
                defaultMessage="You selected file(s) with the same name as already uploaded or already selected files."
              />
            </Typography>
            <Box component="ul" sx={{ pl: 2, my: 0 }}>
              {duplicateNames.map((name) => (
                <li key={name}>
                  <Typography variant="body2">{name}</Typography>
                </li>
              ))}
            </Box>
          </Box>
        }
        confirmLabel={
          <FormattedMessage id="fileUpload.duplicate.overwrite" defaultMessage="Overwrite" />
        }
        cancelLabel={<FormattedMessage id="fileUpload.duplicate.skip" defaultMessage="Skip" />}
        onConfirm={() => {
          applyPendingPickedFiles('overwrite')
        }}
        onCancel={() => {
          applyPendingPickedFiles('skip')
        }}
      />

      <input
        ref={inputRef}
        type="file"
        name={name}
        multiple={multiple}
        accept={accept}
        disabled={isDisabled}
        onChange={handleFilesSelected}
        style={{ display: 'none' }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            <FormattedMessage id="fileUpload.title" defaultMessage="Attachments" />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <FormattedMessage
              id="fileUpload.subtitle"
              defaultMessage="Select file(s) to be attached to this request."
            />
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleOpenPicker}
          disabled={isDisabled}
          label={buttonLabel}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        {existingFiles.length === 0 && displayFiles.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            <FormattedMessage id="fileUpload.empty" defaultMessage="No files attached yet." />
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {existingFiles.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                <FormattedMessage id="fileUpload.existing" defaultMessage="Uploaded files" />
                {existingFilesVersion !== undefined && existingFilesVersion !== null
                  ? ` • v${existingFilesVersion}`
                  : null}
              </Typography>
            )}

            {existingFiles.map((file, index) => {
              const uploadedAt = formatUploadedAt(file.uploadedAt)
              const meta = [uploadedAt].filter(Boolean).join(' • ')

              return (
                <Box
                  key={`${file.id ?? file.name}-${index}`}
                  sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    {getExistingFileIcon(file)}
                    <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                      {file.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {meta ? (
                      <Typography variant="body2" color="text.secondary">
                        {meta}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              )
            })}

            {existingFiles.length > 0 && displayFiles.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                <FormattedMessage id="fileUpload.new" defaultMessage="New files" />
              </Typography>
            )}

            {displayFiles.map((file, index) => (
              <Box
                key={`${file.name}-${file.size}-${file.lastModified}`}
                sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  {getFileIcon(file)}
                  <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                    {file.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatBytes(file.size)}
                  </Typography>
                  <IconButton
                    size="small"
                    disabled={isDisabled}
                    onClick={() => handleRemoveFile(index)}
                    aria-label="remove file"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default FileUpload
