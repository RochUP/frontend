import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
    Breadcrumb,
    Button,
    Col,
    Layout,
    Row,
    Space,
    Modal,
    Tooltip,
    Upload,
    Tabs,
    message,
    Typography,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import {
    UploadOutlined,
    MessageOutlined,
    CheckCircleOutlined,
    FormOutlined,
} from '@ant-design/icons';

import '../../assets/css/Pages.css';
import {
    addQuestionAction,
    addQuestionVoteAction,
    changeDocumentPageAction,
    getQuestionsAction,
    meetingExitAction,
    sortQuestionsByTimeAction,
    sortQuestionsByVoteAction,
    presentChangeAction,
} from '../../actions/meetingActions';
import CommentListComponent from '../../components/meeting/CommentListComponent';
import DocumentComponent from '../../components/meeting/DocumentComponent';
import MeetingHeader from '../../components/meeting/MeetingHeader';
import ModeratorMsgComponent from '../../components/meeting/ModeratorMsgComponent';
import store from '../../store';
import { getQuestions, registerDocument, meetingExit } from '../../utils/api';
import { uploadFile2AzureStorage } from '../../utils/azureStorage';
import Socket from '../../utils/webSocket';
import { receiveData, sendFinishword, sendHandsup } from '../../utils/webSocketUtils';
import { meetingJoinAction } from '../../actions/meetingActions';
import { dateArrayFormatter } from '@ant-design/pro-utils';
import { useMemo } from 'react';

const { Footer, Content } = Layout;
const { Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

type ModeratorMsgSocketType = {
    messageType: string;
    meetingId: number;
    moderatorMsgBody: string;
    isStartPresen: boolean;
    questionId: number;
    userId: string;
    presenterOrder: number;
};

const URL = process.env.REACT_APP_WEBSOCKET_URL;
let isConnected = false;
let socket: Socket;

export default function InMeeting() {
    const navigate = useNavigate();

    const userId = useSelector((state: any) => state.userReducer.userid);
    const meetingName = useSelector((state: any) => state.meetingReducer.meetingName);
    const meetingId = useSelector((state: any) => state.meetingReducer.meetingId);
    const presenterIds = useSelector((state: any) => state.meetingReducer.presenterIds);
    const presenterNames = useSelector((state: any) => state.meetingReducer.presenterNames);
    const presenterIdNow = useSelector((state: any) => state.meetingReducer.presenterIdNow);
    const documentIds = useSelector((state: any) => state.meetingReducer.documentIds);
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);

    const isPresenter = useMemo(() => presenterIds.includes(userId), [presenterIds, userId]);

    //????????????
    const presentOrder = useSelector((state: any) => state.meetingReducer.presentOrder);
    const [spinning, setSpinning] = useState(false);

    //???????????????????????????????????????????????????????????????????????????
    const [nextType, changeNextType] = useState<'present' | 'question' | 'end'>('present');

    useEffect(() => {
        if (meetingId === 0) {
            //join???????????????????????????
            console.log('NOT join');
            navigate('/meeting/join');
        }

        //??????????????????
        SpeechRecognition.startListening({ language: 'ja', continuous: true });

        // ??????????????????get??????
        getPastQuestions();
    }, []);

    const getPastQuestions = async () => {
        await getQuestions(meetingId)
            .then((res) => {
                if (!res.result) {
                    throw new Error('getQuestions error');
                }
                store.dispatch(
                    getQuestionsAction(
                        res.questionIds,
                        res.questionBodys,
                        res.documentIds,
                        res.documentPages,
                        res.questionTimes,
                        res.presenterIds,
                        res.voteNums
                    )
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [tabPresenterId, setTabPresenterId] = useState(presenterIdNow);

    /* websocket??? *************************************/
    const [questionSocket, setQuestionSocket] = useState();
    const [questionVoteSocket, setQuestionVoteSocket] = useState();
    const [reactionSocket, setReactionSocket] = useState();
    const [moderatorMsgSocket, setModeratorMsgSocket] = useState<ModeratorMsgSocketType>();
    const [documentSocket, setDocumentSocket] = useState();
    const [sortMode, setSortMode] = useState<'time' | 'likes'>('time');

    function setData(e: any) {
        let data: any = receiveData(e.data);
        if (data.meetingId === meetingId) {
            // ??????meetingId???????????????????????????????????????????????????
            switch (data.messageType) {
                case 'question':
                    setQuestionSocket(data);
                    store.dispatch(addQuestionAction(data));
                    break;
                case 'question_vote':
                    setQuestionVoteSocket(data);
                    store.dispatch(addQuestionVoteAction(data.questionId, data.voteNum));
                    break;
                case 'reaction':
                    setReactionSocket(data);
                    break;
                case 'moderator_msg':
                    setModeratorMsgSocket(data);
                    if (data.isStartPresen) {
                        store.dispatch(
                            changeDocumentPageAction(presenterIds[data.presenterOrder], 1)
                        );
                        store.dispatch(presentChangeAction(data.presenterOrder));
                        setTabPresenterId(presenterIds[data.presenterOrder]);
                        changeNextType('present');
                    } else if (data.moderatorMsgBody.match(/???????????????/)) {
                        changeNextType('end');
                    } else {
                        changeNextType('question');
                    }
                    break;
                case 'document_update':
                    setDocumentSocket(data);
                    break;
                default:
                    break;
            }
        }
    }

    useEffect(() => {
        if (!isConnected) {
            // ?????????????????????????????????Socket On?????????
            const ws = new WebSocket(URL + '');
            socket = new Socket(ws);
            socket.on('connect', () => {
                console.log('websocket connected');
            });
            socket.on('disconnect', () => {
                console.log('websocket disconnected');
                isConnected = false;
            });
            socket.on('message', setData);
            isConnected = true;
            console.log('websocket on');
        }
    }, []);

    /* ?????????????????????????????? *************************************/
    const finishButtonTitle = useMemo(() => {
        switch (nextType) {
            case 'present':
                return '????????????';
            case 'question':
                return '????????????';
            case 'end':
                return '???????????????????????????';
        }
    }, [nextType]);

    const FinishButton = () => {
        return (
            <Button
                danger
                ghost
                onClick={() => finishOn(nextType)}
                {...(nextType === 'end'
                    ? { type: 'text', disabled: true }
                    : nextType === 'present'
                    ? { icon: <MessageOutlined /> }
                    : { icon: <CheckCircleOutlined /> })}
            >
                {finishButtonTitle}
            </Button>
        );
    };

    const commands = [
        {
            command: '*???????????????*',
            callback: () => {
                let questionUserId = '';
                if (moderatorMsgSocket) questionUserId = moderatorMsgSocket.userId;

                sendFinishword(socket, meetingId, presenterIdNow, questionUserId, nextType);
            },
            // callback: () => {sendPresenFinish()}
        },
        {
            command: '*???????????????*',
            callback: () => {
                let questionUserId = '';
                if (moderatorMsgSocket) questionUserId = moderatorMsgSocket.userId;

                sendFinishword(socket, meetingId, presenterIdNow, questionUserId, nextType);
            },
            // callback: () => {sendQuestionFinish()}
        },
    ];

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
        useSpeechRecognition({ commands });

    /* ?????????????????????????????? *************************************/
    const scripts = useSelector((state: any) => state.meetingReducer.scripts);
    const idx = presenterIds.indexOf(userId);
    let script_default = '';
    if (idx !== -1) {
        script_default = scripts[idx];
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filesList, setFilesList] = useState<UploadFile[]>([]);

    //?????????????????????onChange??????
    const handleChange = (info: UploadChangeParam) => {
        console.log(info.fileList);
        console.log(info.file);
        setFilesList(info.fileList);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const finishOn = (finishtype: string) => {
        let questionUserId = '';
        if (moderatorMsgSocket) questionUserId = moderatorMsgSocket.userId;
        sendFinishword(socket, meetingId, presenterIdNow, questionUserId, finishtype);
    };

    //?????????????????????ok?????????????????????????????????
    const handleOk = async () => {
        if (!isPresenter) {
            alert('You are not presenter');
            setIsModalVisible(false);
            return;
        }
        const documentId = documentIds[idx];
        let documentUrl = null;
        if (filesList.length !== 0) {
            const file = filesList[0].originFileObj;
            documentUrl = await uploadFile2AzureStorage(file);
        }
        const script = (document.getElementById('script_form') as HTMLFormElement).value;

        await registerDocument(documentId, documentUrl, script)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        setIsModalVisible(false);
    };
    //?????????????????????cancel?????????????????????????????????
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    /**************************************************** */
    useEffect(() => {
        return () => {
            console.log('unmounted');
            Exit();
        };
    }, []);

    //????????????
    const Exit = async () => {
        console.log('exit');
        // console.log(userId, meetingId, documentId);

        setSpinning(true);

        await meetingExit(userId, meetingId, documentIds[presentOrder])
            .then((res: any) => {
                console.log(res);
                if (!res.result) {
                    throw new Error('Exit Meeting Failed');
                }
            })
            .catch((err: any) => {
                console.log(err);
                alert(err.message);
            });

        setSpinning(false);
        store.dispatch(meetingExitAction());
        SpeechRecognition.stopListening();
        socket.ws.close();
    };

    const showConfirm = () => {
        confirm({
            title: '?????????????????????',
            content: '?????????????????????????????????????????????????????????????????????????????????',
            okText: '??????',
            okType: 'danger',
            cancelText: '???????????????',
            onOk() {
                navigate('/meeting/join');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    useEffect(() => {
        switch (sortMode) {
            case 'time':
                store.dispatch(sortQuestionsByTimeAction());
                break;
            case 'likes':
                store.dispatch(sortQuestionsByVoteAction());
                break;
        }
    }, [sortMode, questionVoteSocket]);

    return (
        <Layout>
            <MeetingHeader />
            <Content style={{ padding: '0 40px' }}>
                <Typography.Title style={{ margin: '10px 0' }}>{meetingName}</Typography.Title>
                <Breadcrumb style={{ margin: '10px 0' }}>
                    <Breadcrumb.Item>??????ID: {meetingId}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{ background: '#fff' }}>
                    <Row>
                        <Col span={12} style={{ maxHeight: 50 }}></Col>
                        <Col span={12} style={{ maxHeight: 50, width: '100%' }}>
                            {/* style={{background:'#DD2248'}}> */}
                            {/* ????????????????????? */}
                            <Space
                                align="baseline"
                                size={15}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'right',
                                    marginRight: '5%',
                                }}
                            >
                                <FinishButton />
                                <Tooltip
                                    placement="topRight"
                                    title={
                                        isPresenter
                                            ? '?????????????????????????????????????????????'
                                            : '????????????????????????????????????????????????'
                                    }
                                >
                                    {nextType !== 'end' && (
                                        <Button
                                            type="primary"
                                            ghost
                                            icon={<FormOutlined />}
                                            onClick={showModal}
                                            disabled={!isPresenter}
                                        >
                                            ?????????????????????
                                        </Button>
                                    )}
                                    {/* ?????????onOK????????????????????????ok????????? */}
                                    <Modal
                                        title="?????????????????????"
                                        visible={isModalVisible}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                        okText={'??????'}
                                        cancelText={'???????????????'}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {/* <Text>??????????????????????????????</Text> */}
                                            <Upload
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                listType="picture"
                                                data={(file) => ({ file })}
                                                fileList={filesList}
                                                onChange={handleChange}
                                                maxCount={1}
                                                accept=".pdf"
                                                beforeUpload={(file) => {
                                                    const isPdf = file.type === 'application/pdf';
                                                    if (!isPdf) {
                                                        message.error(
                                                            'PDF???????????????????????????????????????!'
                                                        );
                                                        return Upload.LIST_IGNORE;
                                                    }
                                                    return false;
                                                }}
                                            >
                                                <Button
                                                    icon={<UploadOutlined />}
                                                    style={{ width: '100%' }}
                                                >
                                                    ????????????????????????
                                                </Button>
                                            </Upload>
                                            <TextArea
                                                id="script_form"
                                                showCount
                                                defaultValue={script_default}
                                                placeholder="??????"
                                            />
                                        </Space>
                                    </Modal>
                                </Tooltip>
                                <Tooltip placement="topRight" title={'????????????????????????'}>
                                    <Button type="primary" danger onClick={showConfirm}>
                                        ??????
                                    </Button>
                                </Tooltip>
                            </Space>
                        </Col>
                        <ModeratorMsgComponent data={moderatorMsgSocket} />
                        <Tabs
                            type="card"
                            defaultActiveKey={presenterIds[0]}
                            style={{ width: '100%' }}
                            activeKey={tabPresenterId}
                            onTabClick={(key) => {
                                setTabPresenterId(key);
                            }}
                        >
                            {presenterIds.map((presenterId: string, index: number) => {
                                return (
                                    <TabPane tab={presenterNames[index]} key={presenterId}>
                                        <Row>
                                            {/* ?????????????????????????????? */}
                                            {/* <Col span={12} style={{padding:"8px 0", margin:'8px'}}> */}
                                            <Col flex={4} style={{ width: '30%' }}>
                                                <Col span={24}>
                                                    <DocumentComponent
                                                        socket={socket}
                                                        documentSocket={documentSocket}
                                                        ModeratorMsgSocket={moderatorMsgSocket}
                                                        presenterId={presenterId}
                                                        index={index}
                                                    />
                                                </Col>
                                            </Col>
                                            {/* ?????????????????????????????? */}
                                            {/* <Col span={11} style={{padding:"8px 0", margin:'8px'}}> */}
                                            <Col
                                                flex={1}
                                                style={{ marginLeft: '8px', maxWidth: '30%' }}
                                            >
                                                {/* ?????????????????? */}
                                                <CommentListComponent
                                                    socket={socket}
                                                    data={questionSocket}
                                                    presenterId={presenterId}
                                                    sortMode={sortMode}
                                                    setSortMode={setSortMode}
                                                />
                                            </Col>
                                        </Row>
                                    </TabPane>
                                );
                            })}
                        </Tabs>
                    </Row>
                </div>
            </Content>
            <Footer
                style={{
                    position: 'relative',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    maxHeight: 60,
                    textAlign: 'center',
                }}
            >
                Made by RochUP Team
            </Footer>
        </Layout>
    );
}
