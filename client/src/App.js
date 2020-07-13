import React, {Fragment} from 'react';
import './App.css';

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {Provider} from 'mobx-react';
import {stores} from 'stores';
import {routing} from './routing';
//axios.defaults.proxy.port = 4000;

const App = () => {
  //token var mı cookielerde
  // varsa qucik-notes vs gitsin
  return (
    <Provider {...stores}>
      <Router>
        <Switch>
          <Route path="/" component={routing} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
