// think this approach is deprecated

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App'
import Main from './pages/Main'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Main} />
  </Route>
);