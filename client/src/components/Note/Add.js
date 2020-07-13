import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {request} from 'helpers/request';
import {Modal} from 'antd';
import {Input} from 'components/materials/Input';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers';
import {useForm, Controller} from 'react-hook-form';

export const Add = inject('notesStore')(
  observer(props => {
    const {_id} = props;
    const {item} = props.notesStore;
    const category_id = props.category_id;
    const history = useHistory();
    const [noteForm, setNoteForm] = useState({
      title: _id ? item.title : '',
      text: _id ? item.text : '',
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

    const handleCancel = () => {
      history.push(`/categories/${category_id}/notes`);
    };

    const onSubmit = async data => {
      if (_id) {
        props.notesStore.update({category_id: category_id, note_id: _id, data});
        history.push(`/categories/${category_id}/notes`);

        handleCancel();
      } else {
        props.notesStore.add({category_id: category_id, data});
        history.push(`/categories/${category_id}/notes`);
      }
    };

    const schema = Yup.object().shape({
      title: Yup.string().required('Title is required'),

      text: Yup.string().required('Text is required'),
    });

    const {handleSubmit, errors, control, reset, watch} = useForm({
      resolver: yupResolver(schema),
    });

    return (
      <Modal
        visible={true}
        onOk={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        okText={_id ? 'Edit Note' : 'Add Note'}
      >
        <h1>{_id ? 'Edit ' + item.title : 'Add Note '}</h1>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              as={
                <Input
                  name="title"
                  placeholder="Title"
                  errors={errors}
                  defaultValue={_id ? title : ''}
                />
              }
              name="title"
              control={control}
            />

            <Controller
              as={
                <Input
                  name="text"
                  placeholder="Text"
                  errors={errors}
                  defaultValue={_id ? text : ''}
                />
              }
              name="text"
              control={control}
            />
          </form>
        </div>
      </Modal>
    );
  })
);
