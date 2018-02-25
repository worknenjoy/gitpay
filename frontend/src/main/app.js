import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import green from 'material-ui/colors/green';
import './app.css';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-114655639-1');
ReactGA.pageview(window.location.pathname + window.location.search);

import Routes from './routes'

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: blue
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Routes />
    </MuiThemeProvider>
  );
}

//export default App

export default App;
