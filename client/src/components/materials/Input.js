import {Input as AntdInput} from 'antd';
import React, {useState, useEffect} from 'react';
import {Alert} from 'antd';

export const Input = props => {
  const errors = props.errors;
  const [top, setTop] = useState(false);

  const handleFocus = () => setTop(true);
  const handleBlur = e => !e.currentTarget.value.length && setTop(false);

  return (
    <label>
      <span
        style={{
          top: props.value || top ? 0 : 30,
          position: 'relative',
          zIndex: 1,
          transition: `all .2s`,
          fontWeight: 500,
          marginLeft: 9,
        }}
      >
        {props.placeholder}
      </span>
      {props.type === 'password' ? (
        <AntdInput.Password
          {...props}
          style={{marginTop: 5, marginBottom: 5, ...props.style}}
          onFocus={handleFocus}
          onBlur={handleBlur}
          prefix={props.icon}
          placeholder=""
        />
      ) : (
        <AntdInput
          {...props}
          style={{marginTop: 5, marginBottom: 5, ...props.style}}
          onFocus={handleFocus}
          onBlur={handleBlur}
          prefix={props.icon}
          placeholder=""
        />
      )}

      {errors[props.name] && <Alert message={errors[props.name].message} type="error" showIcon />}
    </label>
  );
};
