import {inject, observer} from 'mobx-react';
import React, {Fragment, useEffect, useState} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {Add, Note, PrimaryButton} from 'components';
import {request} from 'helpers/request';
import {Row, Col, Button} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

export const Notes = inject(
  'notesStore',
  'categoriesStore',
  'quickNotesStore'
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
      console.log('delete');
      if (await props.categoriesStore.delete({category_id})) history.push('/quick-notes');
    };

    return (
      <Fragment>
        <div>
          <h1>{category_id}</h1>
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
