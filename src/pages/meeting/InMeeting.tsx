import { Breadcrumb, Button, Card, Col, Divider, Input, Layout, List, Menu, Row, Space, Tabs, Comment, Tooltip } from "antd";
import {
    UserOutlined,
    ArrowUpOutlined,
    CommentOutlined,
    LikeOutlined,
    LikeFilled
} from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import { Typography } from 'antd';
import "../../assets/css/Pages.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { createElement, useState } from "react";

const { Header, Footer, Content } = Layout;

const { Text } = Typography;

const { TabPane } = Tabs;

// function callback(key: any) {
//     console.log(key);
// }

export default function InMeeting() {

    const { Title } = Typography;


    const [likes, setLikes] = useState(0);
    const [action, setAction] : any[] = useState(null);
    
    const like = () => {
        setLikes(1);
        setAction('liked');
    };

    const likeActions = [
        <Tooltip key="comment-basic-like" title="いいね！">
            <span onClick={like}>
                {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                <span className="comment-action">{likes}</span>
            </span>
        </Tooltip>
    ]

    const data = [
        {
            author: '匿名',
            content: (
            <p>
                ここはコメントを表示する。
            </p>
            ),
            datetime: (
                <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment().subtract(1, 'days').fromNow()}</span>
                </Tooltip>
            ),
        },
        // {
        //     author: '匿名',
        //     content: (
        //     <p>
        //         ここはコメント２を表示する。
        //     </p>
        // ),
        // datetime: (
        //     <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
        //     <span>{moment().subtract(2, 'days').fromNow()}</span>
        //     </Tooltip>
        // ),
        // },
    ];

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
                        <Col span={12}> 
                            {/* style={{background:'#DD2248'}}> */}
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
                        <Col span={12}>
                            {/* style={{background:'#DD2248'}}> */}
                            <Title level={4}>コメント一覧</Title>
                        </Col>
                        <Divider />
                        {/* 左側のコンポーネント */}
                        <Col span={12} style={{padding:"8px 0", margin:'8px'}}>
                            <Card style={{ width: '100%', minHeight: 300 }}>
                                <Title level={4}>ここは司会メッセージ</Title>
                                <Divider />
                                This area for slide show
                            </Card>
                        </Col>
                        {/* 右側のコンポーネント */}
                        <Col span={11} style={{padding:"8px 0", margin:'8px'}}>
                            <Card style={{ width: '100%', minHeight: 300 }}>
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="発表者1" key="1">
                                        <List
                                            className="comment-list"
                                            itemLayout="horizontal"
                                            dataSource={data}
                                            renderItem={item => (
                                                <li>
                                                    <Comment
                                                        actions={likeActions}
                                                        author={item.author}
                                                        content={item.content}
                                                        datetime={item.datetime}
                                                    />
                                                </li>
                                            )}
                                        />
                                    </TabPane>
                                    <TabPane tab="発表者2" key="2">
                                        <List
                                                className="comment-list"
                                                itemLayout="horizontal"
                                                dataSource={data}
                                                renderItem={item => (
                                                    <li>
                                                        <Comment
                                                            actions={likeActions}
                                                            author={item.author}
                                                            content={item.content}
                                                            datetime={item.datetime}
                                                        />
                                                    </li>
                                                )}
                                        />
                                    </TabPane>
                                </Tabs>
                            </Card>    
                        </Col>
                        {/* 左側操作エリア */}
                        <Col span={12} style={{padding:"8px 0", margin:'8px'}}>
                            <Button type="primary" icon={<ArrowUpOutlined />} style={{width:'100%'}}>Hands up</Button>
                        </Col>
                        {/* 右側操作エリア */}
                        <Col span={11} style={{padding:"8px 0", margin:'8px'}}>
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

