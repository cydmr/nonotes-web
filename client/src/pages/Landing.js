import {inject, observer} from 'mobx-react';
import {Spin, Alert} from 'antd';
import React, {useEffect, useState} from 'react';
import {request} from 'helpers/request';
import {Redirect} from 'react-router';
import {toJS} from 'mobx';

export const Landing = inject('categoriesStore')(
  observer(props => {
    const {state} = props.categoriesStore;

    return (
      <React.Fragment>
        {state !== 'done' ? (
          <Spin tip="Loadin...">
            <Alert
              message="Alert message title"
              description="Further details about the context of this alert."
              type="info"
            />
          </Spin>
        ) : (
          <Redirect to="/categories/hizli-notlar/notes"></Redirect>
        )}
      </React.Fragment>
    );
  })
);
