import { Breadcrumb, Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import { Typography } from 'antd';
import '../../assets/css/Pages.css';

const { Header, Footer, Content } = Layout;

export default function Template() {
    const { Title } = Typography;

    return (
        <Layout>
            <Header>
                <Menu theme="dark" mode="horizontal">
                    <SubMenu
                        key="sub1"
                        icon={<UserOutlined />}
                        title="ユーザ"
                        style={{ paddingLeft: '90%' }}
                    >
                        <Menu.Item key="1">プロファイル</Menu.Item>
                        <Menu.Item key="2">ログアウト</Menu.Item>
                    </SubMenu>
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Title style={{ margin: '16px 0' }}>○○システム</Title>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>このページの機能はここで表示します</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{ background: '#fff' }}>
                    Content
                </div>
            </Content>
            <Footer
                style={{
                    borderTop: '1px solid #e8e8e8',
                    position: 'fixed',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                Made by RochUP Team
            </Footer>
        </Layout>
    );
}
