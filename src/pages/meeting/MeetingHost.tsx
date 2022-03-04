import { Breadcrumb, Button, Card, DatePicker, Input, Layout, Menu, Space, } from "antd";
import {
    UserOutlined
  } from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import { Typography } from 'antd';
import { Link } from "react-router-dom";
// import jaJP from 'antd/es/locale/ja_JP';
import "../../assets/css/Pages.css";

const { Header, Footer, Content } = Layout;

function onChange(value: any, dateString: any) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }
  
  function onOk(value: any) {
    console.log('onOk: ', value);
  }
  

export default function MeetingHost() {

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
                    <Breadcrumb.Item>会議</Breadcrumb.Item>
                    <Breadcrumb.Item>会議作成</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{background: '#fff', margin:'16px 0'}}>
                    <Card title="ミーティングに作成する" bordered={false} style={{ width: '100%', textAlign:'center' }}>
                        <Space direction="vertical" style={{width: '100%'}}>
                            <p style={{margin:'16px 0'}}>ミーティングを作成するために、詳細設定で設定してください。</p>
                            <Space>
                                <span>発表者</span>
                                <Input style={{width: '120%', textAlign:'center'}} placeholder="発表者を入力してください" ></Input>
                            </Space>
                            <Space>
                                <span>開始時間</span>
                                <DatePicker showTime onChange={onChange} onOk={onOk} />
                            </Space>
                            <Space>
                                <span>会議名</span>
                                <Input style={{width: '120%', textAlign:'center'}} placeholder="会議名を入力してください" ></Input>
                            </Space>

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

