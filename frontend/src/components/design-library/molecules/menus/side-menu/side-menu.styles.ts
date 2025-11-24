import { styled } from '@mui/material/styles'

export const SidePaper = styled('div')(({ theme }) => ({
  backgroundColor: '#2c5c46',
  height: 'fit-content',
  width: 'fit-content',
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}))

export const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}))

export const MainHeaderWrapper = styled('div')(({ theme }) => ({
  padding: '10px 0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  }
}))

export const Profile = styled('div')(({ theme }) => ({
  '& .profile-image': {
    width: 80,
    height: 80,
    objectFit: 'cover',
    maxWitdh: '100%',
    borderRadius: '50%',
    marginBottom: 8,
    border: '4px solid white'
  },
  '& .name': {
    textAlign: 'center',
    color: theme.palette.primary.dark,
    fontSize: '1.2rem'
  },
  '& .website': {
    textAlign: 'center',
    color: '#515bc4',
    fontSize: '0.8rem'
  },
  '& .details': {
    textAlign: 'center',
    marginTop: 10,
    padding: '12px 0 5px 0',
    backgroundColor: '#4D7E6F',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  '& .details-mid': {
    textAlign: 'center',
    marginTop: 10,
    padding: '12px 0 5px 0',
    backgroundColor: '#4D7E6F',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  '& .num': {
    color: '#eee',
    fontSize: '1.5rem'
  },
  '& .buttons': {
    background: 'transparent',
    width: '220px',
    height: '50px',
    textTransform: 'none',
    marginTop: '25px',
    borderRadius: 0,
    justifyContent: 'center',
    border: '2px solid white',
    color: 'white'
  },
  '& .buttons-disabled': {
    background: 'transparent',
    width: '220px',
    height: '50px',
    textTransform: 'none',
    marginTop: '25px',
    borderRadius: 0,
    justifyContent: 'center',
    border: '2px solid #999',
    color: '#999'
  },
  '& .icon': {
    height: '25px',
    width: '25px',
    marginLeft: 15
  }
}))

export default {
  SidePaper,
  Row,
  MainHeaderWrapper,
  Profile
}
