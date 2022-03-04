import { Breadcrumb, Button, Card, Col, Divider, Input, Layout, Menu, Row, Space, Tabs } from "antd";
import {
    UserOutlined,
    ArrowUpOutlined,
    CommentOutlined
  } from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import { Typography } from 'antd';
import "../../assets/css/Pages.css";
import { Link } from "react-router-dom";

const { Header, Footer, Content } = Layout;

const { Text } = Typography;

const { TabPane } = Tabs;

function callback(key: any) {
    console.log(key);
}

export default function InMeeting() {

    const { Title } = Typography;

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
            <Content style={{padding:'0 50px'}}>
                <Title style={{margin:'16px 0'}}>
                    ○○システム
                </Title>
                <Breadcrumb style={{margin:'16px 0'}}>
                    <Breadcrumb.Item>会議</Breadcrumb.Item>
                    <Breadcrumb.Item>会議中</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{background: '#fff'}}>
                    <Row>
                        <Col span={12} style={{background:'#DD2248'}}>
                            <Title level={3}>○○会議進行中</Title>
                            <Space direction="vertical">
                                <Text type="secondary">会議ID:</Text>
                                <div className="meeting-control">
                                    <Link to={'../meeting/join'}>
                                        <Button type="primary" style={{marginRight:'10px'}}>退出</Button>
                                    </Link>
                                </div>
                            </Space>
                        </Col>
                        <Col span={12} style={{background:'#DD2248'}}>
                            <Title level={4}>コメント一覧</Title>
                        </Col>
                        <Divider />
                        {/* 左側のコンポーネント */}
                        <Col span={12} style={{background:'#DD2248', padding:"8px 0", margin:'8px'}}>
                            <Card style={{ width: '100%', minHeight: 300 }}>
                                <Title level={4}>ここは司会メッセージ</Title>
                                <Divider />
                                This area for slide show
                            </Card>
                        </Col>
                        {/* 右側のコンポーネント */}
                        <Col span={11} style={{background:'#DD2248', padding:"8px 0", margin:'8px'}}>
                            <Card style={{ width: '100%', minHeight: 300 }}>
                                <Tabs defaultActiveKey="1" onChange={callback}>
                                    <TabPane tab="発表者1" key="1">
                                        This area for comment to presenter No.1
                                    </TabPane>
                                    <TabPane tab="発表者2" key="2">
                                        This area for comment to presenter No.2
                                    </TabPane>
                                </Tabs>
                            </Card>    
                        </Col>
                        {/* 左側操作エリア */}
                        <Col span={12} style={{background:'#DD2248', padding:"8px 0", margin:'8px'}}>
                            <Button type="primary" icon={<ArrowUpOutlined />} style={{width:'100%'}}>Hands up</Button>
                        </Col>
                        {/* 右側操作エリア */}
                        <Col span={11} style={{background:'#DD2248', padding:"8px 0", margin:'8px'}}>
                            <Input placeholder="ここでコメントを書いてください" style={{width:'80%'}}></Input>
                            <Button type="primary" icon={<CommentOutlined />} style={{width:'20%'}}>Comment</Button>
                        </Col>
                    </Row>
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

