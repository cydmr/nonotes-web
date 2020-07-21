import {inject, observer} from 'mobx-react';
import React, {Fragment, useEffect, useState} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {Add, Note, PrimaryButton} from 'components';
import {Row, Col, Button} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

export const Notes = inject(
  'notesStore',
  'categoriesStore',
  'quickNotesStore',
  'authStore'
)(
  observer(props => {
    const {_id, page, category_id} = useParams();
    const isAction = ['edit', 'add'].includes(page);

    const {state, list} = props.notesStore;
    const history = useHistory();
    useEffect(() => {
      props.notesStore.read({category_id});
    }, [props.notesStore, category_id]);

    const handleDelete = async () => {
      if (await props.categoriesStore.delete({category_id})) history.push('/quick-notes');
    };

    return (
      <Fragment>
        <div>
          <PrimaryButton
            onClick={() => {
              props.authStore.logout();
            }}
          >
            LOGOUT
          </PrimaryButton>
        </div>
        <div>
          <DeleteOutlined style={{marginLeft: 7, color: 'red'}} onClick={handleDelete} />
        </div>

        <div>{isAction && <Add _id={_id} category_id={category_id} />}</div>

        <div
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <PrimaryButton to={`/categories/${category_id}/notes/add`} text="Add Note" />
        </div>

        {state !== 'listing' && (
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
            <Col span={8} key={'add-note'}>
              <div>Add +</div>
            </Col>
          </Row>
        )}
      </Fragment>
    );
  })
);
