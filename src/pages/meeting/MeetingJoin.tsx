import {
    Breadcrumb,
    Button,
    Card,
    Col,
    InputNumber,
    Layout,
    Row,
    Space,
    Spin,
    Typography,
    Modal,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/Pages.css';
import { useSelector } from 'react-redux';
import { meetingJoin } from '../../utils/api';
import store from '../../store';
import { meetingJoinAction } from '../../actions/meetingActions';
import MeetingHeader from '../../components/meeting/MeetingHeader';
import { useEffect, useState } from 'react';

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

    return (
        <Spin size="large" spinning={spinning}>
            <Layout>
                <MeetingHeader />
                <Layout.Content style={{ padding: '0 50px', margin: '16px 0', height: '100%' }}>
                    <Typography.Title style={{ margin: '16px 0' }}>Plithos</Typography.Title>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>会議</Breadcrumb.Item>
                        <Breadcrumb.Item>会議参加</Breadcrumb.Item>
                    </Breadcrumb>
                    <Row gutter={[16, 16]}>
                        <Col
                            xs={{ span: 24 }}
                            lg={{ span: 12 }}
                            // className="site-layout-content"
                            // style={{ background: '#fff', margin: '16px 0' }}
                        >
                            <Card
                                title="会議に参加する"
                                bordered={false}
                                style={{ minHeight: '300px', width: '100%', textAlign: 'center' }}
                            >
                                <Space
                                    direction="vertical"
                                    style={{ width: '100%', textAlign: 'center' }}
                                >
                                    <p>会議ID</p>
                                    <InputNumber
                                        id="meetingId"
                                        type={'number'}
                                        style={{ minWidth: '200px', textAlign: 'center' }}
                                        placeholder="会議IDを入力"
                                        min={1}
                                        controls={false}
                                        onChange={onChangeMeetingId}
                                    />
                                    <p style={{ margin: '16px 0' }}>
                                        会議開催者から会議IDを取得してください
                                    </p>
                                    <Button
                                        type="primary"
                                        // style={{ width: '20%' }}
                                        onClick={joinMeeting}
                                        disabled={!inputOk}
                                    >
                                        会議に参加する
                                    </Button>
                                </Space>
                            </Card>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            lg={{ span: 12 }}
                            // className="site-layout-content"
                            // style={{ background: '#fff', margin: '16px 0' }}
                        >
                            <Card
                                title="会議開催者ですか？"
                                bordered={false}
                                style={{ minHeight: '300px', width: '100%', textAlign: 'center' }}
                            >
                                <p style={{ margin: '16px 0' }}>会議情報を設定してください</p>
                                <Link to={'../meeting/host'}>
                                    <Button
                                        type="primary"
                                        // style={{ width: '20%' }}
                                    >
                                        会議を作成する
                                    </Button>
                                </Link>
                            </Card>
                        </Col>
                    </Row>
                </Layout.Content>
                <Layout.Footer
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
                </Layout.Footer>
            </Layout>
        </Spin>
    );
}
