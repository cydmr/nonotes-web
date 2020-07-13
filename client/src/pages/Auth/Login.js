import {inject, observer} from 'mobx-react';
import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers';
import {Input, PrimaryButton} from 'components';
import * as Yup from 'yup';
import {request} from 'helpers/request';
import {useHistory} from 'react-router';

export const Login = inject(
  'categoriesStore',
  'authStore'
)(
  observer(props => {
    const history = useHistory();

    // const {state} = props.categoriesStore;
    const schema = Yup.object().shape({
      email: Yup.string().required('Email is required').email('Please enter a valid email address'),
      password: Yup.string().required('Password is required').min(6),
    });

    const {handleSubmit, errors, control} = useForm({
      criteriaMode: 'all',
      resolver: yupResolver(schema),
    });
    const onSubmit = async data => {
      props.authStore.login(data);
      history.push('/');
    };

    //ref={register({})}
    return (
      <React.Fragment>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <PrimaryButton to={`/register`} text="Register"></PrimaryButton>
        </div>
      </React.Fragment>
    );
  })
);
