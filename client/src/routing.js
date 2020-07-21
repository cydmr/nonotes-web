import React, {useEffect} from 'react';
import {Landing} from 'pages/Landing';
import {Register, Login} from 'pages/Auth';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Notes} from 'pages/Notes/Notes';
import {QuickNotes} from 'pages/Notes/QuickNotes';
import {Drawer, Button, Row, Col} from 'antd';
import {LeftMenu, CollapseMenu} from 'components';
import {inject, observer} from 'mobx-react';

const NotFound = () => {
  return <div>404 NotFound</div>;
};
const RedirectToLogin = () => {
  return <Redirect to="/login"> </Redirect>;
};

export const routing = inject('authStore')(
  observer(props => {
    const {token} = props.authStore;

    useEffect(() => {
      props.authStore.handleAuth();
    });
    return token ? (
      <React.Fragment>
        <Row>
          <Col>
            <CollapseMenu />
          </Col>

          <Col style={{flex: 1}}>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/quick-notes" component={QuickNotes} />
              <Route exact path="/categories/:category_id/notes/:page?/:_id?" component={Notes} />
              <Route component={NotFound} />
            </Switch>
          </Col>
        </Row>
      </React.Fragment>
    ) : (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route component={RedirectToLogin}></Route>
      </Switch>
    );
  })
);
