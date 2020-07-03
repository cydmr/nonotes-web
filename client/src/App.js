import React, {Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Notes} from 'pages/Notes/Notes';
import {QuickNotes} from 'pages/Notes/QuickNotes';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import {Drawer, Button, Row, Col} from 'antd';
import {LeftMenu, CollapseMenu} from 'components';
import {Provider} from 'mobx-react';
import {stores} from 'stores';
import {Landing} from 'pages/Landing';

//axios.defaults.proxy.port = 4000;
const NotFound = () => {
  return <div>404 NotFound</div>;
};

const App = () => {
  return (
    <Provider {...stores}>
      <Router>
        <Fragment>
          <Row>
            <Col>
              <CollapseMenu />
            </Col>

            <Col style={{flex: 1}}>
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route exact path="/categories/hizli-notlar/notes" component={QuickNotes} />
                <Route exact path="/categories/:category_id/notes/:page?/:_id?" component={Notes} />
                <Route component={NotFound} />
              </Switch>
            </Col>
          </Row>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
