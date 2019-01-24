const styles = theme => ({
  appBarHeader: {
    color: theme.palette.primary
  },
  bgContrast: {
    backgroundColor: '#D1DDE9'
  },
  iconFill: {
    backgroundColor: theme.palette.secondary.main
  },
  appBar: {
    height: '100%',
    widht: '100%'
  },
  root: {
    flexGrow: 1,
    marginTop: 0
  },
  icon: {
    marginTop: -4,
    marginRight: 5
  },
  button: {
    margin: theme.spacing.unit,
    padding: [theme.spacing.unit * 2, theme.spacing.unit * 4],
    color: 'white'
  },
  altButton: {
    margin: [theme.spacing.unit],
    padding: [theme.spacing.unit / 2, theme.spacing.unit * 6],
    color: 'white',
    fontSize: 12
  },
  mainBlock: {
    textAlign: 'center',
    padding: 8,
    color: theme.palette.text.primary
  },
  secBlock: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#f1f0ea'
  },
  seclist: {
    textAlign: 'left',
    width: '100%'
  },
  listIconTop: {
    alignItems: 'flex-start'
  },
  spacedTop: {
    marginTop: 20
  },
  tagline: {
    fontSize: 36,
    color: 'black'
  }
})

export default styles
