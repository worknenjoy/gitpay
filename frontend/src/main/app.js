import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { StripeProvider } from 'react-stripe-elements';
import blue from 'material-ui/colors/blue';
import green from 'material-ui/colors/green';
import './app.css';
import ReactGA from 'react-ga';

import Routes from './routes'
import NotificationContainer from '../containers/notification';

import reducers from '../reducers/reducers';

if(process.ENV == 'production') {
  ReactGA.initialize('UA-114655639-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const store = createStore(
  reducers,
  compose(
    applyMiddleware(
      thunkMiddleware
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: blue
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <StripeProvider apiKey="pk_test_pBA57lmPZbGhidkUUphTZZdB">
        <Provider store={store}>
          <div>
            <NotificationContainer />
            <Routes />
          </div>
        </Provider>
      </StripeProvider>
    </MuiThemeProvider>
  );
}

export default App;
