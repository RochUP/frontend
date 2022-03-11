import { Button, Card, InputNumber, Layout, Space, Spin, Typography, Modal, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/Pages.css';
import { useSelector } from 'react-redux';
import { meetingJoin } from '../../utils/api';
import store from '../../store';
import { meetingJoinAction } from '../../actions/meetingActions';
import MeetingHeader from '../../components/meeting/MeetingHeader';
import { useEffect, useState } from 'react';
import MeetingHost from './MeetingHost';
// import ProForm from '@ant-design/pro-form';

export default function MeetingJoin() {
    const navigate = useNavigate();

    const userid = useSelector((state: any) => state.userReducer.userid);

    useEffect(() => {
        if (userid === '') {
            navigate('/login');
        }
    }, []);

    const [spinning, setSpinning] = useState<boolean>(false);
    const [meetingId, setMeetingId] = useState<number>(0);
    const [inputOk, setInputOk] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const onChangeMeetingId = (value: number) => {
        console.log(value);
        setMeetingId(value);
    };

    useEffect(() => {
        setInputOk(meetingId != null && meetingId > 0);
    }, [meetingId]);

    const joinMeeting = async () => {
        console.log('Join Meeting');
        const meetingId = +(document.getElementById('meetingId') as HTMLInputElement).value;
        console.log(userid, meetingId);

        setSpinning(true);

        await meetingJoin(userid, meetingId)
            .then((res: any) => {
                console.log(res);
                if (!res.result) {
                    throw new Error('Join Meeting Failed');
                }
                storeMeetingData(res);
                navigate('/meeting/in');
            })
            .catch((err: any) => {
                console.log(err);
                // alert(err.message);
                Modal.error({
                    title: '会議に参加できませんでした',
                    content: '会議IDが間違っているか、会議が存在しません',
                    okText: '了解',
                });
            });

        setSpinning(false);
    };

    const storeMeetingData = (res: any) => {
        const meetingId = +(document.getElementById('meetingId') as HTMLInputElement).value || 0;
        store.dispatch(
            meetingJoinAction(
                meetingId,
                res.meetingName,
                res.meetingStartTime,
                res.presenterIds,
                res.presenterNames,
                res.documentIds
            )
        );
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Spin size="large" spinning={spinning}>
            <Layout>
                <MeetingHeader />
                <Layout.Content style={{ padding: '0 50px', margin: '16px 0', height: '100%' }}>
                    <Typography.Title style={{ margin: '16px 25px' }}>
                        会議参加 / 作成
                    </Typography.Title>
                    {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>会議参加/作成</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <Card
                        title="会議に参加する"
                        bordered={false}
                        style={{
                            minHeight: '300px',
                            width: '80%',
                            textAlign: 'center',
                            margin: '0 auto',
                        }}
                    >
                        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                            {/* <ProForm
                                    submitter={{
                                        submitButtonProps: {
                                            style: {
                                                display: 'none',
                                            },
                                        },
                                        resetButtonProps: {
                                            style: {
                                                display: 'none',
                                            },
                                        },
                                    }}
                                    onFinish={joinMeeting}
                                    isKeyPressSubmit={true}
                                    > */}
                            <p>会議ID</p>
                            <InputNumber
                                id="meetingId"
                                type={'number'}
                                style={{ minWidth: '200px', textAlign: 'center' }}
                                placeholder="会議IDを入力してください"
                                min={1}
                                controls={false}
                                onChange={onChangeMeetingId}
                                onPressEnter={joinMeeting}
                            />
                            <p style={{ margin: '16px 0' }}>
                                会議開催者から会議IDを取得してください
                            </p>
                            <Button
                                type="primary"
                                style={{ width: '20%' }}
                                onClick={joinMeeting}
                                disabled={!inputOk}
                            >
                                会議に参加する
                            </Button>
                            {/* </ProForm> */}
                        </Space>
                        <Divider />
                        <div className="ant-card-head">会議開催者ですか？</div>
                        <p style={{ margin: '16px 0' }}>会議情報を設定してください</p>
                        <Button type="primary" onClick={showModal} style={{ width: '20%' }}>
                            会議を作成する
                        </Button>
                        {/* ここは会議作成のポップアップ */}
                        <Modal
                            title="会議作成"
                            visible={isModalVisible}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            width={1000}
                            footer={null}
                        >
                            <MeetingHost setHostModalVisiable={setIsModalVisible} />
                        </Modal>
                    </Card>
                </Layout.Content>
                <Layout.Footer
                    style={{
                        position: 'fixed',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        maxHeight: 60,
                        textAlign: 'center',
                    }}
                >
                    Made by RochUP Team
                </Layout.Footer>
            </Layout>
        </Spin>
    );
}
