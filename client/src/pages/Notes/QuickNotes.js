import {inject, observer} from 'mobx-react';
import React, {Fragment, useEffect, useState} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {Add, Note, PrimaryButton} from 'components';
import {request} from 'helpers/request';
import {Row, Col, Button} from 'antd';

export const QuickNotes = inject('quickNotesStore')(
  observer(props => {
    const {state, list} = props.quickNotesStore;

    useEffect(() => {
      props.quickNotesStore.read();
    }, [props.quickNotesStore]);

    return (
      <Fragment>
        <div>
          <h1>Quick Notes</h1>
        </div>

        <div
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
            textAlign: 'center',
            width: '100%',
          }}
        ></div>

        {state === 'done' && (
          <Row
            gutter={16}
            style={{
              flex: 1,
              justifyContent: 'start',
              display: 'flex',
            }}
          >
            {list.map(i => (
              <Col span={8} key={i._id}>
                <Note note={i}></Note>
              </Col>
            ))}
          </Row>
        )}
      </Fragment>
    );
  })
);
