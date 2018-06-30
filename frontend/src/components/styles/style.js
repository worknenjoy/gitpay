const styles = theme => ({
  appBarHeader: {
    color: theme.palette.primary
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
  divider: {
    textAlign: 'center',
    display: 'inline-block',
    marginLeft: '35%',
    marginBottom: '5%',
    marginTop: 40,
    fontSize: 18,
    paddingBottom: 10,
    borderBottom: '5px solid black',
    width: '30%'
  },
  mainlist: {
    textAlign: 'left',
    marginLeft: '20%'
  },
  infoList: {
    textAlign: 'left',
    marginLeft: '10%'
  },
  seclist: {
    textAlign: 'left',
    width: '100%'
  },
  listIconTop: {
    alignItems: 'flex-start'
  },
  alignLeftPadding: {
    textAlign: 'left',
    padding: 80,
    paddingTop: 40
  },
  spacedTop: {
    marginTop: 20
  },
  defaultCenterBlock: {
    textAlign: 'center',
    padding: 10,
    color: theme.palette.text.primary
  },
  logoSimple: {
    textAlign: 'left',
    overflow: 'hidden',
    paddingTop: 20
  },
  tagline: {
    fontSize: 36,
    color: 'black'
  }
})

export default styles
