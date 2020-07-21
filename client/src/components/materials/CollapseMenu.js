import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {Menu, Button, Divider} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  PlusOutlined,
  DeleteOutlined,
  PushpinOutlined,
} from '@ant-design/icons';
import {Redirect} from 'react-router';
import {Modal, Row, Col} from 'antd';
import {Input, MenuItem} from 'components';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers';
import {useForm, Controller} from 'react-hook-form';

const {SubMenu} = Menu;
const {confirm} = Modal;

export const CollapseMenu = inject('categoriesStore')(
  observer(props => {
    const [collapsed, setcollapse] = useState(false);
    const {list, state} = props.categoriesStore;
    const [visible, setVisible] = useState(false);

    const history = useHistory();

    const toggleCollapsed = () => {
      setcollapse(!collapsed);
    };

    const handleDelete = category_id => {
      props.categoriesStore.delete({category_id});
    };

    const onSubmit = async data => {
      if (await props.categoriesStore.add({data})) handleCancel();
    };

    useEffect(() => {
      props.categoriesStore.read();
    }, [props.categoriesStore]);

    const handleAdd = () => {
      setVisible(true);
    };

    const handleCancel = () => {
      console.log('rest');
      setVisible(false);
      reset();
    };

    const schema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
    });

    const {handleSubmit, errors, control, reset, watch} = useForm({
      resolver: yupResolver(schema),
    });
    // console.log(watch());

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
              // defaultSelectedKeys={['1']}
              // defaultOpenKeys={['sub1']}
              mode="inline"
              theme="light"
              inlineCollapsed={collapsed}
            >
              <Menu.Item
                // style={{color: 'purple', backgroundColor: 'light-blue'}}
                // key="1"
                onClick={() => {
                  history.push('/quick-notes');
                }}
                icon={<PushpinOutlined style={{color: 'purple'}} />}
              >
                Quick Notes
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
              onOk={handleSubmit(onSubmit)}
            >
              {visible && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    as={<Input name="name" placeholder="Name" errors={errors} />}
                    name="name"
                    control={control}
                    defaultValue=""
                  />

                  <Controller
                    as={<Input name="description" placeholder="Description" errors={errors} />}
                    name="description"
                    control={control}
                    defaultValue=""
                  />

                  <input type="submit" />
                </form>
              )}
            </Modal>
          </div>
        ) : (
          <Redirect to="/"></Redirect>
        )}
      </React.Fragment>
    );
  })
);
