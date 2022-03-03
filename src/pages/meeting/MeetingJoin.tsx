import { Breadcrumb, Button, Card, Input, Layout, Menu, Space } from "antd";
import {
    UserOutlined
  } from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import { Typography } from 'antd';
import { Link } from "react-router-dom";
import "../../assets/css/Pages.css";

const { Header, Footer, Content } = Layout;

export default function MeetingJoin() {

    const { Title } = Typography;

    return (
        <Layout >
            <Header>
                <Menu theme="dark" mode="horizontal" >
                    <SubMenu key="sub1" icon={<UserOutlined />} title='ユーザ' style={{paddingLeft:'90%'}}>
                        <Menu.Item key="1">プロファイル</Menu.Item>
                        <Link to={'../login'}>
                            <Menu.Item key="2">ログアウト</Menu.Item>
                        </Link>
                    </SubMenu>
                </Menu>
            </Header>
            <Content style={{padding:'0 50px', margin:'16px 0', height:'100%',}}>
                <Title style={{margin:'16px 0'}}>
                    ○○システム
                </Title>
                <Breadcrumb style={{margin:'16px 0'}}>
                    <Breadcrumb.Item>会議参加</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{background: '#fff', margin:'16px 0'}}>
                    <Card title="ミーティングに参加する" bordered={false} style={{ width: '100%', textAlign:'center' }}>
                        <Space direction="vertical" style={{width: '100%'}}>
                            <p>ミーティングID</p>
                            <Input type={'number'} style={{width: '20%', textAlign:'center'}} placeholder="ミーティングIDを入力してください" />
                            <p style={{margin:'16px 0'}}>ミーティングに参加するために、ミーティング開催者からミーティングを取得してください。</p>
                            <Button type="primary" style={{width: '20%'}}>ミーティングに参加する</Button>
                        </Space>
                    </Card>                    
                </div>
                <Breadcrumb style={{margin:'16px 0'}}>
                    <Breadcrumb.Item>会議作成</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{background: '#fff', margin:'16px 0'}}>
                    <Card title="ミーティングに作成する" bordered={false} style={{ width: '100%', textAlign:'center' }}>
                        <Space direction="vertical" style={{width: '100%'}}>
                            <p>ミーティングID</p>
                            <Input style={{width: '20%', textAlign:'center'}}></Input>
                            <p style={{margin:'16px 0'}}>ミーティングを作成するために、詳細設定で設定してください。</p>
                            <Button type="primary" style={{width: '20%'}}>ミーティングを作成する</Button>
                        </Space>
                    </Card>                    
                </div>
            </Content>
            <Footer style={{ 
                borderTop: '1px solid #e8e8e8',
                position: 'fixed',
                left: 0,
                bottom: 0,
                width: '100%',
                textAlign: 'center',}}>
                Made by RochUP Team
            </Footer>
        </Layout>
    );
};

