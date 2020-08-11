import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import SignedIn from './containers/signedIn';
import SignedOut from './containers/signedOut';
//import CounterPage from './containers/CounterPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.SIGNEDOUT} component={SignedOut} />
        <Route path={routes.SIGNEDIN} component={SignedIn} />
      </Switch>
    </App>
  );
}
