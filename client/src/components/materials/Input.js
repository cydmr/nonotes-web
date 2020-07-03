import {Input as AntdInput} from 'antd';
import React, {useState, useEffect} from 'react';

export const Input = props => {
  const [top, setTop] = useState(props.defaultValue ? 0 : 30);
  const handleFocus = () => setTop(0);

  const handleBlur = e => {
    const el = e.currentTarget;
    const value = el.value;
    if (!value.length) {
      setTop(30);
    }
  };

  useEffect(() => {
    if (props.defaultValue) setTop(0);
  }, [props.defaultValue]);

  const handleChange = e => {
    const el = e.currentTarget;
    const value = el.value;

    if (value) {
      setTop(0);
    }
    if (props.hasOwnProperty('onChange')) return props.onChange(e);
  };
  return (
    <label>
      <span
        style={{
          top,
          position: 'relative',
          zIndex: 1,
          transition: `all .2s`,
          fontWeight: 500,
          marginLeft: 9,
        }}
      >
        {props.placeholder}
      </span>
      <AntdInput
        {...props}
        style={{marginTop: 5, marginBottom: 5, ...props.style}}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        prefix={props.icon}
        placeholder=""
      />
    </label>
  );
};
