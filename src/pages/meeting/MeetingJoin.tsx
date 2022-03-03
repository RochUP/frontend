import { Layout, Menu } from "antd";
import {
    UserOutlined
  } from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";

const { Header, Footer, Content } = Layout;

export default function MeetingJoin() {
    return (
        <Layout>
        <Header>
            <Menu theme="dark" mode="horizontal" >
                <SubMenu key="sub1" icon={<UserOutlined />} title='ユーザ' style={{paddingLeft:'90%'}}>
                    <Menu.Item key="1">プロファイル</Menu.Item>
                    <Menu.Item key="2">ログアウト</Menu.Item>
                </SubMenu>
            </Menu>
        </Header>
        <Content>Content</Content>
        <Footer style={{paddingBottom:'10%'}}>Footer</Footer>
        </Layout>
    );
};

