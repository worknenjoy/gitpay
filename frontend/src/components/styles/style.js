const styles = theme => ({
  appBarHeader: {
    color: theme.palette.primary
  },
  alignRight: {
    textAlign: 'right'
  },
  alignLeft: {
    textAlign: 'left'
  },
  gutterTop: {
    marginTop: theme.spacing(2)
  },
  gutterTopSmall: {
    marginTop: theme.spacing(1)
  },
  gutterBottomBig: {
    marginBottom: theme.spacing(3)
  },
  bgContrast: {
    backgroundColor: '#D1DDE9'
  },
  iconFill: {
    backgroundColor: theme.palette.secondary.main
  },
  iconFillAlt: {
    backgroundColor: theme.palette.primary.dark
  },
  sectionBgAlt: {
    backgroundColor: theme.palette.primary.contrastText
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
    margin: theme.spacing(1),
    padding: [theme.spacing(2), theme.spacing(4)],
    color: 'white'
  },
  altButton: {
    margin: [theme.spacing(1)],
    padding: [theme.spacing(0.5), theme.spacing(6)],
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
