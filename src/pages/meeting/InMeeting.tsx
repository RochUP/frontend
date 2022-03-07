import { Breadcrumb, Button, Card, Col, Divider, Layout, Menu, Row, Space, Modal, Tooltip, Upload } from "antd";
import {
    UserOutlined,
    ArrowUpOutlined,
    UploadOutlined
} from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import { Typography } from 'antd';
import "../../assets/css/Pages.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentListComponent from "../../components/meeting/CommentListComponent";

import Socket from "../../utils/webSocket";
import { receiveData } from "../../utils/webSocketUtils";
import PdfViewerComponent from "../../components/testComponents/PdfViewerComponent";
import MeetingHeader from "../../components/meeting/MeetingHeader";
import { useSelector } from "react-redux";

const { Header, Footer, Content } = Layout;

const { Text } = Typography;

const URL = process.env.REACT_APP_WEBSOCKET_URL;
const ws = new WebSocket(URL+"");
let socket = new Socket(ws);

export default function InMeeting() {
    const meetingId = useSelector((state: any) => state.meetingReducer.meetingId);

    const [questionSocket, setQuestionSocket] = useState();
    const [questionVoteSocket, setQuestionVoteSocket] = useState();
    const [reactionSocket, setReactionSocket] = useState();
    const [moderatorMsgSocket, setModeratorMsgSocket] = useState();
    const [documentSocket, setDocumentSocket] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const showModal = () => {
        setIsModalVisible(true);
    };
    //ポップアップのokボタンを押した時の処理
    const handleOk = () => {
        setIsModalVisible(false);
    };
    //ポップアップのcancelボタンを押した時の処理
    const handleCancel = () => {
        setIsModalVisible(false);
    };

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
            <MeetingHeader />
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
                            <Text type="secondary" style={{marginLeft: 5}}>{meetingId}</Text>
                        </Col>
                        <Col span={12} style={{maxHeight: 50}}>
                            {/* style={{background:'#DD2248'}}> */}
                            {/* 右側操作ボタン */}
                            <Space align="baseline" style={{marginLeft:'70%'}}>
                                <Tooltip placement="topRight" title={'発表者は原稿を登録してください'}>
                                    <Button onClick={showModal}  style={{marginLeft:'60%'}}>原稿登録</Button>
                                    {/* ここのonOKはポップアップのokボタン */}
                                    <Modal title = "原稿登録" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText={"アップロード"} cancelText={"キャンセル"}>
                                        <Space direction="vertical" style={{width:'100%'}}>
                                            <Text>原稿を登録しますか？</Text>
                                            <Upload
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                listType="picture"
                                                maxCount={1}
                                                >
                                                <Button icon={<UploadOutlined />} style={{width:'100%'}}>原稿アップロード</Button>
                                            </Upload>
                                        </Space>
                                    </Modal>
                                </Tooltip>
                                <Tooltip placement="topRight" title={'会議を退出します'}>
                                    <Link to={'../meeting/join'} style={{marginLeft:'90%'}}>
                                        <Button type="primary" danger>退出</Button>
                                    </Link>
                                </Tooltip>
                            </Space>
                        </Col>
                        <Divider />
                        {/* 左側のコンポーネント */}
                        {/* <Col span={12} style={{padding:"8px 0", margin:'8px'}}> */}
                        <Col flex={4} style={{width:'30%'}}>
                            <Col span={24}>
                                <Card title="ここで司会メッセージを表示する" style={{ width: '100%', minHeight: 500, maxHeight: 500, textAlign: 'center' }}>
                                    {/* <Title level={4}>ここで司会メッセージを表示する</Title> */}
                                    {/* <Divider /> */}
                                    {/* <p style={{minHeight: 360, textAlign:'left'}}>This area for slide show</p> */}
                                    <Space direction="horizontal" style={{maxHeight: 500, width:'100%'}}>
                                        <Card type="inner" style={{maxHeight: 500, width: 600}}>
                                            <PdfViewerComponent></PdfViewerComponent>
                                        </Card>
                                        <Card type="inner" style={{maxHeight: 500}}>
                                            <p style={{width: 550, minHeight: 350, textAlign:'left'}}>This area for 原稿</p>
                                        </Card>
                                    </Space>
                                </Card>
                            </Col>
                            <Col span={24} style={{padding:"8px 0", margin:'8px'}}>
                                <Button type="primary" icon={<ArrowUpOutlined />} style={{width:'45%', marginLeft:'25%'}}>Hands up</Button>
                            </Col>
                        </Col>
                        {/* 右側のコンポーネント */}
                        {/* <Col span={11} style={{padding:"8px 0", margin:'8px'}}> */}
                        <Col flex={1} style={{marginLeft:'8px', maxWidth:'30%'}}>
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

