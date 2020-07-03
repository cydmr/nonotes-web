import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {DeleteOutlined} from '@ant-design/icons';
import {request} from 'helpers/request';
import {Modal, Card} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {GrNotes} from 'react-icons/all';

export const Note = inject(
  'notesStore',
  'quickNotesStore'
)(
  observer(props => {
    // const {title, text, category, _id} = props.note;
    const {_id, text, title, category, isQuick} = props.note;

    const handleDelete = () => {
      Modal.confirm({
        title: 'Do you Want to delete this note?',
        icon: <ExclamationCircleOutlined />,
        content: 'Some descriptions',
        onOk: () => {
          props.notesStore.delete({category_id: category, note_id: _id});
          // request.delete(`/api/notes/${_id}`);
        },
      });
    };

    //hizli notlara ekleme

    const handleQuickNote = async () => {
      const res = await props.notesStore.quick({category_id: category, note_id: _id});
      if (!res.isQuick) props.quickNotesStore.delete(_id);
    };

    return (
      <Fragment>
        <Card
          title={
            <Fragment>
              <div>
                <GrNotes onClick={handleQuickNote} /> {title}
              </div>
            </Fragment>
          }
          extra={
            <Fragment>
              <Link to={`/categories/${category}/notes/edit/${_id}`} style={{color: 'purple'}}>
                Edit
              </Link>
              <div>
                <DeleteOutlined style={{marginLeft: 7, color: 'red'}} onClick={handleDelete} />
              </div>{' '}
            </Fragment>
          }
          style={{margin: '2%', background: 'pink'}}
        >
          <p>{text}</p>
        </Card>
      </Fragment>
    );
  })
);
