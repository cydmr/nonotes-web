import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {Menu, Button, Divider} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {Redirect} from 'react-router';
import {Modal, Row, Col} from 'antd';
import {Input, MenuItem} from 'components';

const {SubMenu} = Menu;
const {confirm} = Modal;

export const CollapseMenu = inject('categoriesStore')(
  observer(props => {
    const [collapsed, setcollapse] = useState(false);
    const {list, state} = props.categoriesStore;
    const [visible, setVisible] = useState(false);

    const toggleCollapsed = () => {
      setcollapse(!collapsed);
    };

    const handleDelete = category_id => {
      console.log('delete');
      props.categoriesStore.delete({category_id});
    };

    const [categoryForm, setCategoryForm] = useState({
      name: '',
      description: '',
    });

    const {name, description} = categoryForm;

    const onChange = e => {
      console.log({e, target: e.target.name});
      setCategoryForm({...categoryForm, [e.target.name]: e.target.value});
    };

    const onSubmit = async () => {
      const category = categoryForm;
      if (await props.categoriesStore.add({data: category})) handleCancel();
    };

    useEffect(() => {
      props.categoriesStore.read();
    }, [props.categoriesStore]);

    const handleAdd = () => {
      setVisible(true);
    };

    const handleCancel = () => {
      setVisible(false);
      setCategoryForm({name: '', description: ''});
    };

    // useEffect(() => {
    //   if (_id) {
    //     props.notesStore.read({_id, category_id});
    //   }
    // }, [_id, category_id, props.notesStore]);

    return (
      <React.Fragment>
        {state === 'done' ? (
          <div style={{transition: `all .2s`}}>
            <Button type="primary" onClick={toggleCollapsed}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            </Button>

            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme="light"
              inlineCollapsed={collapsed}
            >
              <Menu.Item
                style={{color: 'purple', backgroundColor: 'light-blue'}}
                key="1"
                icon={<PieChartOutlined />}
              >
                <Link to={'/categories/hizli-notlar/notes'}> Quick Notes</Link>
              </Menu.Item>

              <Menu.Item
                onClick={handleAdd}
                // style={{backgroundColor: 'pink'}}
                icon={<PlusOutlined style={{color: 'blue'}} />}
              >
                Create Category
              </Menu.Item>

              {list.map(i => (
                <Menu.Item key={i._id} icon={<DesktopOutlined />}>
                  <MenuItem key={i._id} data={i} />{' '}
                  {/* <Link key={'1'} to={`/categories/${i._id}/notes`}>
                    {i.name}
                  </Link>{' '}
                  <Divider type={'vertical'}></Divider>{' '}
                  <DeleteOutlined
                    key={'2'}
                    style={{marginLeft: 7, color: 'red'}}
                    onClick={handleDelete}
                  /> */}
                  {/* <MenuItem key={i._id} data={i} onDelete={handleDelete} />{' '} */}
                </Menu.Item>
              ))}
              {/* <SubMenu
                style={{backgroundColor: 'yellow'}}
                key="sub1"
                icon={<MailOutlined />}
                title="Navigation One"
              >
                <Menu.Item key="5">Option 5</Menu.Item>
               
              </SubMenu>
              <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <SubMenu key="sub3" title="Submenu">
                  <Menu.Item key="11">Option 11</Menu.Item>
                  <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
              </SubMenu> */}
            </Menu>
            <Modal
              visible={visible}
              title={'Create Category'}
              onCancel={handleCancel}
              onOk={onSubmit}
            >
              <Input
                placeholder="Name"
                name="name"
                value={name}
                defaultValue={name}
                onChange={onChange}
              />

              <Input
                placeholder="Description"
                name="description"
                value={description}
                defaultValue={description}
                onChange={onChange}
              />
            </Modal>
          </div>
        ) : (
          <Redirect to="/"></Redirect>
        )}
      </React.Fragment>
    );
  })
);
