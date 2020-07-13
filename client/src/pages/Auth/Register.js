import {inject, observer} from 'mobx-react';
import {Spin, Alert} from 'antd';
import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers';
import {Input, PrimaryButton} from 'components';
import * as Yup from 'yup';
import {request} from 'helpers/request';
import {toJS} from 'mobx';

export const Register = inject(
  'categoriesStore',
  'authStore'
)(
  observer(props => {
    const schema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string().required('Email is required').email('Please enter a valid email address'),
      password: Yup.string().required('Password is required').min(6),
    });

    const {handleSubmit, errors, control} = useForm({
      criteriaMode: 'all',
      resolver: yupResolver(schema),
    });
    const onSubmit = async data => {
      props.authStore.register(data);
    };

    return (
      <React.Fragment>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            as={<Input name="name" placeholder="Name" errors={errors} />}
            name="name"
            control={control}
          />
          <Controller
            as={<Input name="email" placeholder="E-Mail" errors={errors} />}
            name="email"
            control={control}
          />

          <Controller
            as={<Input name="password" placeholder="Password" errors={errors} />}
            name="password"
            control={control}
          />

          <input type="submit" />
        </form>

        <div>
          <PrimaryButton to={`/login`} text="Login"></PrimaryButton>
        </div>
      </React.Fragment>
    );
  })
);
