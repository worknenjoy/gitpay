import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import api from '../../../../../../consts'

const DonateToPlatformFundsConfirmation = () => {
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [open, setOpen] = useState(false)

  const history = useHistory()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const donate = async () => {
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
      const token = params.get('token')

      try {
        await axios.post(`${api.API_URL}/tasks/${id}/donate-to-platform-funds`, { token })
        setSuccess(true)
      } catch {
        setSuccess(false)
      } finally {
        setLoading(false)
        setOpen(true)
      }
    }
    donate()
  }, [id])

  return (
    <div>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <CircularProgress />
        </div>
      )}
      <Dialog open={open} aria-labelledby="donate-dialog-title" aria-describedby="donate-dialog-description">
        <DialogTitle id="donate-dialog-title">
          {success ? 'Bounty donated' : 'Something went wrong'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="donate-dialog-description">
            {success
              ? 'Thank you — the bounty has been donated to the Gitpay platform fund. Your contribution helps keep open-source sustainable.'
              : 'We could not process your request. The link may have expired or already been used. Please contact us at contact@gitpay.me if you need help.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => history.push(`/task/${id}`)}>
            Back to issue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DonateToPlatformFundsConfirmation
