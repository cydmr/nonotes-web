import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {Menu, Row, Col} from 'antd';
import {DesktopOutlined, DeleteOutlined} from '@ant-design/icons';

export const MenuItem = props => {
  const {data} = props;
  const handleDelete = () => {
    console.log('delete on item');
    props.onDelete(data._id);
  };
  return (
    <React.Fragment>
      <Link to={`/categories/${data._id}/notes`}>{data.name}</Link>
    </React.Fragment>
  );
};
