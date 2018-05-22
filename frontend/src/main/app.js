import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { StripeProvider } from 'react-stripe-elements';
import blue from 'material-ui/colors/blue';
import green from 'material-ui/colors/green';
import { createStore } from 'redux';
import './app.css';
import ReactGA from 'react-ga';

import { addNotification } from '../actions/actions';
import NotificationContainer from '../containers/notification';

import reducers from '../reducers/reducers';
import { Provider } from 'react-redux';

if(process.ENV == 'production') {
  ReactGA.initialize('UA-114655639-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

import Routes from './routes'

store.dispatch(addNotification('Bem vindo ao Gitpay!'));

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
            <Routes />
            <NotificationContainer />
          </div>
        </Provider>
      </StripeProvider>
    </MuiThemeProvider>
  );
}

export default App;
