import { Breadcrumb, Button, Col, Layout, Row, Space, Modal, Tooltip, Upload, Tabs, message, Typography } from "antd";
import {
    ArrowUpOutlined,
    UploadOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';
import "../../assets/css/Pages.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentListComponent from "../../components/meeting/CommentListComponent";
import Socket from "../../utils/webSocket";
import { receiveData, sendFinishword, sendHandsup } from "../../utils/webSocketUtils";
import MeetingHeader from "../../components/meeting/MeetingHeader";
import { useSelector } from "react-redux";
import DocumentComponent from "../../components/meeting/DocumentComponent";
import ModeratorMsgComponent from "../../components/meeting/ModeratorMsgComponent";
import store from "../../store";
import { addQuestionAction, changeDocumentPageAction, meetingExitAction } from "../../actions/meetingActions";
import TextArea from "antd/lib/input/TextArea";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import React from 'react';
import { uploadFile2AzureStorage } from "../../utils/azureStorage";
import { registerDocument } from "../../utils/api";


const { Footer, Content } = Layout;
const { Text } = Typography;
const { TabPane } = Tabs;

const URL = process.env.REACT_APP_WEBSOCKET_URL;
const ws = new WebSocket(URL+"");
let socket = new Socket(ws);

export default function InMeeting() {
    
    const navigate = useNavigate();

    const userId = useSelector((state: any) => state.userReducer.userid);
    const meetingId = useSelector((state: any) => state.meetingReducer.meetingId);
    
    useEffect (() => {
        if(meetingId === 0){ //joinしてなかったら戻る
            console.log("NOT join")
            navigate("/meeting/join");
        }

        //音声認識開始
        SpeechRecognition.startListening({ language: 'ja', continuous: true})
    }, [])

    const presenterIds = useSelector((state: any) => state.meetingReducer.presenterIds);
    const presenterNames = useSelector((state: any) => state.meetingReducer.presenterNames);
    const presenterIdNow = useSelector((state: any) => state.meetingReducer.presenterIdNow)
    const documentIds = useSelector((state: any) => state.meetingReducer.documentIds);
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);

    /* websocket系 *************************************/
    const [questionSocket, setQuestionSocket] = useState();
    const [questionVoteSocket, setQuestionVoteSocket] = useState();
    const [reactionSocket, setReactionSocket] = useState();
    const [moderatorMsgSocket, setModeratorMsgSocket] = useState();
    const [documentSocket, setDocumentSocket] = useState();

    function setData(e:any) {  
        let data: any = receiveData(e.data);
        if (data.meetingId === meetingId) { // 別のmeetingIdのデータを受け取った場合は無視する
            switch (data.messageType) {
                case "question":
                    setQuestionSocket(data);
                    store.dispatch(addQuestionAction(data))
                    break;
                case "question_vote":
                    setQuestionVoteSocket(data);
                    break;
                case "reaction":
                    setReactionSocket(data);
                    break;
                case "moderator_msg":
                    setModeratorMsgSocket(data);
                    if (data.isStartPresen) {
                        store.dispatch(changeDocumentPageAction(presenterIds[data.presenterOrder], 1));
                    }
                    if (data.userId === userId) {
                        handleHandsdown(false);
                    }
                    break;
                case "document_update":
                    setDocumentSocket(data);
                    break;
                default:
                    break;
            }
        }
    }
    useEffect(()=>{
        // 初回レンダリング時のみSocket Onにする
        console.log("socket on");
        socket.on("message", setData);
    },[])
    /**************************************************** */
  
    /* 発表，質問の終了判定 *************************************/
    const commands = [
        {
            command: "*発表を終わ*",
            callback: ()=> {sendFinishword(socket, meetingId, presenterIdNow, "present")}
            // callback: () => {sendPresenFinish()}
        },
        {
            command: "*質問を終わ*",
            callback: ()=>{sendFinishword(socket, meetingId, presenterIdNow, "question")}
            // callback: () => {sendQuestionFinish()}
        }
    ]

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    // function sendPresenFinish(){
    //     resetTranscript;
    //     sendFinishword(socket, meetingId, presenterIdNow, "present");
    // }

    // function sendQuestionFinish(){
    //     resetTranscript;
    //     sendFinishword(socket, meetingId, presenterIdNow, "question")
    // }

    // setTimeout(()=>resetTranscript,5000); 
  
    /**************************************************** */
  
    const { Title } = Typography;

    /* 資料アップロード処理 *************************************/
    const scripts = useSelector((state: any) => state.meetingReducer.scripts);
    const idx = presenterIds.indexOf(userId);
    let script_default = ""
    if (idx !== -1) {
        script_default = scripts[idx];
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filesList, setFilesList] = useState<UploadFile[]>([]);

    //アップロードのonChange関連
    const handleChange = (info: UploadChangeParam) => {
        console.log(info.fileList);
        console.log(info.file);
        setFilesList(info.fileList);
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const finishOn = (finishtype: string)=>{
        sendFinishword(socket, meetingId, presenterIdNow, finishtype);
    }

    //ポップアップのokボタンを押した時の処理
    const handleOk = async () => {
        const idx = presenterIds.indexOf(userId);
        if(idx === -1){
            alert("You are not presenter");
            setIsModalVisible(false);
            return;
        }
        const documentId = documentIds[idx];
        let documentUrl = null;
        if (filesList.length !== 0) {
            const file = filesList[0].originFileObj;
            documentUrl = await uploadFile2AzureStorage(file);
        }
        const script = (document.getElementById("script_form") as HTMLFormElement).value;
        
        await registerDocument(documentId, documentUrl, script)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });

        setIsModalVisible(false);
    };
    //ポップアップのcancelボタンを押した時の処理
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    /**************************************************** */

    /* 挙手ボタン ********************************************************/

    const [isHandsup, setIsHandsup] = useState(false);
    const [handsupDocumentIdNow, setHandsupDocumentIdNow] = useState(0); // 今あげている挙手のdocumentId
    const [handsupDocumentPageNow, setHandsupDocumentPageNow] = useState(0); // 今あげている挙手のdocumentPage
    const [handsupBottonType, setHandsupBottonType] = useState<"primary" | "default" | "link" | "text" | "ghost" | "dashed" | undefined>("primary");
    const [handsupBottonIcon, setHandsupBottonIcon] = useState(<ArrowUpOutlined />);
    const [handsupText, setHandsupText] = useState("手を挙げる");

    const onClickHansup = (documentId: number) => {
        if (!isHandsup) {
            // 手を挙げたら
            handleHandsup(documentId);
        }else{
            handleHandsdown(true);
        }
    }

    const handleHandsup = (documentId: number) => {
        sendHandsup(socket, userId, documentId, documentPageNow, true);
        setHandsupDocumentIdNow(documentId);
        setHandsupDocumentPageNow(documentPageNow);

        setIsHandsup(true);
        setHandsupBottonType("ghost");
        setHandsupBottonIcon(<ArrowDownOutlined />);
        setHandsupText("手を下ろす");
    }

    const handleHandsdown = (send: boolean) => {
        if (send) {
            sendHandsup(socket, userId, handsupDocumentIdNow, handsupDocumentPageNow, false);
        }

        setIsHandsup(false);
        setHandsupBottonType("primary");
        setHandsupBottonIcon(<ArrowUpOutlined />);
        setHandsupText("手を挙げる");
    }

    /**************************************************** */

    const onClickExit = () => {
        console.log('exit');
        store.dispatch(meetingExitAction());
        SpeechRecognition.stopListening();
        socket.off("", ()=>{});
    }

    return (
        <Layout>
            <MeetingHeader />
            <Content style={{padding:'0 50px'}}>
            <Button onClick={() => finishOn("present")}>発表終了</Button>
            <Button onClick={() => finishOn("question")}>質問終了</Button>
            <p>{transcript}</p>
                <Title style={{margin:'16px 0'}}>
                    ○○会議進行中
                </Title>
                <Breadcrumb style={{margin:'16px 0'}}>
                    <Breadcrumb.Item>会議</Breadcrumb.Item>
                    <Breadcrumb.Item>会議中</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{background: '#fff'}}>
                    <Row>
                        <Col span={12} style={{maxHeight: 50}}> 
                            {/* style={{background:'#DD2248'}}> */}
                            <Text type="secondary">会議ID:</Text>
                            <Text type="secondary" style={{marginLeft: 5}}>{meetingId}</Text>
                        </Col>
                        <Col span={12} style={{maxHeight: 50}}>
                            {/* style={{background:'#DD2248'}}> */}
                            {/* 右側操作ボタン */}
                            <Space align="baseline" style={{marginLeft:'70%'}}>
                                <Tooltip placement="topRight" title={'発表者は原稿を登録してください'}>
                                    <Button onClick={showModal}  style={{marginLeft:'60%'}}>原稿登録</Button>
                                    {/* ここのonOKはポップアップのokボタン */}
                                    <Modal title = "原稿登録" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText={"登録"} cancelText={"キャンセル"}>
                                        <Space direction="vertical" style={{width:'100%'}}>
                                            <Text>原稿を登録しますか？</Text>
                                            <Upload
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                listType="picture"
                                                data={file => ({ file })}
                                                fileList={filesList}
                                                onChange={handleChange}
                                                maxCount={1}
                                                accept=".pdf"
                                                beforeUpload={(file) => {
                                                    const isPdf = file.type === 'application/pdf';
                                                    if(!isPdf){
                                                        // message.error('PDFファイルを選択してください!');
                                                        return Upload.LIST_IGNORE;
                                                    }
                                                    return false;}}
                                                >
                                                <Button icon={<UploadOutlined />} style={{width:'100%'}}>原稿アップロード</Button>
                                            </Upload>
                                            <TextArea id="script_form" showCount defaultValue={script_default}/>
                                        </Space>
                                    </Modal>
                                </Tooltip>
                                <Tooltip placement="topRight" title={'会議を退出します'}>
                                    <Link to={'../meeting/join'} style={{marginLeft:'90%'}}>
                                        <Button type="primary" danger onClick={onClickExit}>退出</Button>
                                    </Link>
                                </Tooltip>
                            </Space>
                        </Col>
                        <ModeratorMsgComponent data={moderatorMsgSocket}/>
                        <Tabs type="card" defaultActiveKey={presenterIds[0]} style={{width:'100%'}} activeKey={presenterIdNow}>
                            {
                                presenterIds.map((presenterId:string, index:number) => {
                                    return (
                                        <TabPane tab={presenterNames[index]} key={presenterId} >
                                            <Row>
                                                {/* 左側のコンポーネント */}
                                                {/* <Col span={12} style={{padding:"8px 0", margin:'8px'}}> */}
                                                <Col flex={4} style={{width:'30%'}}>
                                                    <Col span={24}>
                                                        <DocumentComponent socket={documentSocket} presenterId={presenterId} index={index}/>
                                                    </Col>
                                                    <Col span={24} style={{padding:"8px 0", margin:'8px'}}>
                                                        <Button type={handsupBottonType} icon={handsupBottonIcon} style={{width:'45%', marginLeft:'25%'}} onClick={() => onClickHansup(documentIds[index])}>{handsupText}</Button>
                                                    </Col>
                                                </Col>
                                                {/* 右側のコンポーネント */}
                                                {/* <Col span={11} style={{padding:"8px 0", margin:'8px'}}> */}
                                                <Col flex={1} style={{marginLeft:'8px', maxWidth:'30%'}}>
                                                    {/* コメント一覧 */}
                                                    <CommentListComponent socket={socket} data={questionSocket} presenterId={presenterId}/>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    )
                                })
                            }
                        </Tabs>
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

