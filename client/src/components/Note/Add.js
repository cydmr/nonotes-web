import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {request} from 'helpers/request';
import {Modal} from 'antd';
import {Input} from 'components/materials/Input';

export const Add = inject('notesStore')(
  observer(props => {
    const {_id} = props;
    const {item} = props.notesStore;
    const category_id = props.category_id;
    const history = useHistory();
    const [noteForm, setNoteForm] = useState({
      title: item._id ? item.title : '',
      text: item._id ? item.text : '',
    });

    const {title, text} = noteForm;

    console.log({_id, item, noteForm});

    useEffect(() => {
      if (_id) {
        props.notesStore.read({_id, category_id});
      }
    }, [_id, category_id, props.notesStore]);

    //TODO whaaat?
    useEffect(() => {
      if (item._id) setNoteForm({title: item.title, text: item.text});
    }, [item]);

    const onChange = e => {
      setNoteForm({...noteForm, [e.target.name]: e.target.value});
      //console.log(noteForm);
    };

    const handleCancel = () => {
      history.push(`/categories/${category_id}/notes`);
    };

    const onSubmit = async e => {
      e.preventDefault();
      const note = noteForm;

      if (_id) {
        console.log(category_id);
        props.notesStore.update({category_id: category_id, note_id: _id, data: note});
        history.push(`/categories/${category_id}/notes`);
      } else {
        console.log(category_id);

        props.notesStore.add({category_id: category_id, data: note});
        history.push(`/categories/${category_id}/notes`);
      }
    };

    return (
      <Modal
        visible={true}
        onOk={onSubmit}
        onCancel={handleCancel}
        okText={_id ? 'Edit Note' : 'Add Note'}
      >
        <h1>
          {_id ? 'Edit ' : 'Add '} Note {item.title}
        </h1>
        <div>
          {' '}
          <Input
            placeholder="Title"
            name="title"
            value={title}
            defaultValue={item.title}
            onChange={e => {
              onChange(e);
            }}
          />
          <Input
            placeholder="Text"
            name="text"
            value={text}
            defaultValue={item.text}
            onChange={e => {
              onChange(e);
            }}
          />
        </div>
      </Modal>
    );
  })
);
