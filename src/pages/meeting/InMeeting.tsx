import { Breadcrumb, Button, Card, Col, Divider, Layout, Menu, Row } from "antd";
import {
    UserOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import { Typography } from 'antd';
import "../../assets/css/Pages.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentListComponent from "../../components/meeting/CommentListComponent";

import Socket from "../../utils/webSocket";
import { receiveData } from "../../utils/webSocketUtils";

const { Header, Footer, Content } = Layout;

const { Text } = Typography;

const URL = process.env.REACT_APP_WEBSOCKET_URL;
const ws = new WebSocket(URL+"");
let socket = new Socket(ws);

export default function InMeeting() {
    const [questionSocket, setQuestionSocket] = useState();
    const [questionVoteSocket, setQuestionVoteSocket] = useState();
    const [reactionSocket, setReactionSocket] = useState();
    const [moderatorMsgSocket, setModeratorMsgSocket] = useState();
    const [documentSocket, setDocumentSocket] = useState();

    function setData(e:any) {  
        let data: any = receiveData(e.data);
        switch (data.messageType) {
            case "question":
                setQuestionSocket(data);
                break;
            case "question_vote":
                setQuestionVoteSocket(data);
                break;
            case "reaction":
                setReactionSocket(data);
                break;
            case "moderator_msg":
                setModeratorMsgSocket(data);
                break;
            case "document":
                setDocumentSocket(data);
                break;
            default:
                break;
        }
    }
    useEffect(()=>{
        // 初回レンダリング時のみSocket Onにする
        console.log("socket on");
        socket.on("message", setData);
    },[])

    const { Title } = Typography;

    return (
        <Layout>
            <Header style={{maxHeight: 60}}>
                <Menu theme="dark" mode="horizontal" style={{maxHeight: 60}}>
                    <SubMenu key="sub1" icon={<UserOutlined />} title='ユーザ' style={{paddingLeft:'90%'}}>
                        <Menu.Item key="1">プロファイル</Menu.Item>
                        <Link to={'../login'}>
                            <Menu.Item key="2">ログアウト</Menu.Item>
                        </Link>
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
                        <Col span={12} style={{maxHeight: 50}}> 
                            {/* style={{background:'#DD2248'}}> */}
                            <Title level={3} style={{marginLeft:'5%'}}>○○会議進行中</Title>
                            <Text type="secondary" style={{marginLeft:'5%'}}>会議ID:</Text>
                            <Text type="secondary" style={{marginLeft: 5}}>ABCD1234567890</Text>
                        </Col>
                        <Col span={12} style={{maxHeight: 50}}>
                            {/* style={{background:'#DD2248'}}> */}
                            <Link to={'../meeting/join'} style={{marginLeft:'90%'}}>
                                        <Button type="primary" danger>退出</Button>
                            </Link>
                            <Title level={4} style={{marginLeft:'40%', width:'50%'}}>コメント一覧</Title>
                        </Col>
                        <Divider />
                        {/* 左側のコンポーネント */}
                        <Col span={12} style={{padding:"8px 0", margin:'8px'}}>
                            <Col span={24}>
                                <Card style={{ width: '100%', minHeight: 341, maxHeight: 500 }}>
                                    <Title level={4}>ここで司会メッセージを表示する</Title>
                                    <Divider />
                                    <p style={{minHeight: 341}}>This area for slide show</p>
                                </Card>
                            </Col>
                            <Col span={24} style={{padding:"8px 0", margin:'8px'}}>
                                <Button type="primary" icon={<ArrowUpOutlined />} style={{width:'45%', marginLeft:'25%'}}>Hands up</Button>
                            </Col>
                        </Col>
                        {/* 右側のコンポーネント */}
                        <Col span={11} style={{padding:"8px 0", margin:'8px'}}>
                            {/* コメント一覧 */}
                            <CommentListComponent socket={socket} data={questionSocket}/>
                        </Col>
                    </Row>
                </div>
            </Content>
            <Footer style={{ 
                position: 'relative',
                left: 0,
                bottom: 0,
                width: '100%',
                maxHeight: 60,
                textAlign: 'center',}}>
                Made by RochUP Team
            </Footer>
        </Layout>
    );
};

