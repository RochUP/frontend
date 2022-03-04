import { Breadcrumb, Button, Card, Row, DatePicker, Input, Layout, Menu, Space, Col, } from "antd";
import {
    UserOutlined,
    PlusOutlined,
    MinusOutlined
  } from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import { Typography } from 'antd';
import { Link } from "react-router-dom";
// import jaJP from 'antd/es/locale/ja_JP';
import "../../assets/css/Pages.css";
import { useState } from "react";

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

    const [presenters, setPresenters] = useState<string[]>([""]);

    const onClickAdd = () => {
        const newPresenters =[...presenters, ""];
        setPresenters(newPresenters);
    }

    const onClickRemove = () => {
        if (presenters.length > 1) {
            const newPresenters =[...presenters];
            newPresenters.pop();
            setPresenters(newPresenters);
        }
    }

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
                    <Card title="ミーティングを作成する" bordered={false} style={{ width: '100%', textAlign:'center' }}>
                        <Space direction="vertical" style={{width: '100%'}}>
                                <p>ミーティングを作成するために、詳細設定で設定してください。</p>
                            <Row gutter={[16,16]}>
                                <Col span={8}></Col>
                                <Col span={8}>
                                    <Space direction="vertical">
                                        <Row>
                                            <Space>
                                                <span>会議名</span>
                                                <Input style={{width: '135%'}} placeholder="会議名を入力してください" ></Input>
                                            </Space>
                                        </Row>
                                        <Row>
                                            <Space>
                                                <span>開始時間</span>
                                                <DatePicker style={{width: '113%'}} showTime onChange={onChange} onOk={onOk} />
                                            </Space>
                                        </Row>
                                        {presenters.map((presenter, _) => {
                                            return (
                                                <Row key={presenter}>
                                                    <Space>
                                                        <span>発表者</span>
                                                        <Input style={{width: '100%', textAlign:'center'}} placeholder="発表者を入力してください" ></Input>
                                                        <Button onClick={onClickAdd} type="primary" icon={<PlusOutlined />} size={"small"} />
                                                        <Button onClick={onClickRemove} type="primary" danger icon={<MinusOutlined />} size={"small"} />
                                                    </Space>
                                                </Row>
                                            )
                                        })}
                                    </Space>
                                </Col>
                                <Col span={8}></Col>
                            </Row>
                            <Button type="primary" style={{width: '20%'}}>ミーティングを作成する</Button>
                            <Link to={'../meeting/join'}>
                                <Button type="default" style={{width: '20%'}}>キャンセル</Button>
                            </Link>
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

