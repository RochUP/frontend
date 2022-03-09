import {
    Breadcrumb,
    Button,
    Card,
    Row,
    DatePicker,
    Input,
    Layout,
    Space,
    Col,
    Spin,
    Modal,
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/Pages.css';
import { useEffect, useState } from 'react';
import { meetingCreate, meetingJoin } from '../../utils/api';
import store from '../../store';
import { meetingJoinAction } from '../../actions/meetingActions';
import MeetingHeader from '../../components/meeting/MeetingHeader';
import { useSelector } from 'react-redux';

const { Footer, Content } = Layout;

// function onChange(value: any, dateString: any) {
//     console.log('Selected Time: ', value);
//     console.log('Formatted Selected Time: ', dateString);
// }

function onOk(value: any) {
    console.log('onOk: ', value);
}

export default function MeetingHost() {
    const { Title } = Typography;
    const navigate = useNavigate();

    const userid = useSelector((state: any) => state.userReducer.userid);

    useEffect(() => {
        if (userid === '') {
            navigate('/login');
        }
    }, []);

    const [spinning, setSpinning] = useState(false);
    const [presenters, setPresenters] = useState<string[]>(['']);

    const onClickAdd = () => {
        const newPresenters = [...presenters, ''];
        setPresenters(newPresenters);
    };

    const onClickRemove = () => {
        if (presenters.length > 1) {
            const newPresenters = [...presenters];
            newPresenters.pop();
            setPresenters(newPresenters);
        }
    };

    function onChange(value: any, dateString: any) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }

    function error() {
        Modal.error({
            title: 'エラー',
            content: 'ミーティング作成できませんでした。',
        });
    }

    function destoryAll() {
        Modal.destroyAll();
    }

    function success() {
        Modal.success({
            content: '会議を作成しました。',
            okButtonProps: {
                onClick: () => {
                    navigate('/meeting/in');
                    destoryAll();
                },
            },
        });
    }

    const createMeeting = async () => {
        console.log('Create Meeting');
        const meetingName = (document.getElementById('meetingName') as HTMLInputElement).value;
        const meetingDate = (document.getElementById('meetingDate') as HTMLInputElement).value;
        const presenterIds = new Array<string>(presenters.length);
        for (let i = 0; i < presenterIds.length; i++) {
            presenterIds[i] = (
                document.getElementById('presenterId' + i) as HTMLInputElement
            ).value;
        }
        console.log(meetingName);
        console.log(meetingDate);
        console.log(presenterIds);

        // TODO:
        // - レスポンスが帰ってくるまでロード画面にする
        // - 作成完了したら画面遷移
        // - 返ってくるのはidだけになったのでどこかでjoinリクエストを投げる

        setSpinning(true);

        await meetingCreate(meetingName, meetingDate, presenterIds)
            .then((res) => {
                console.log(res);
                if (!res.result) {
                    throw new Error('Meeting Create Failed');
                }
                // storeMeetingData(res);
                // alert("meeting ID: "+res.meetingId+" created");
                joinMeeting(res.meetingId);
            })
            .catch((err) => {
                console.log(err);
                // alert(err.message);
                error();
                setSpinning(false);
            });
    };

    const joinMeeting = async (meetingId: number) => {
        console.log('Join Meeting');
        console.log(userid, meetingId);

        // TODO:
        // - レスポンスが帰ってくるまでロード画面にする
        // - 作成完了したら画面遷移

        setSpinning(true);

        await meetingJoin(userid, meetingId)
            .then((res: any) => {
                console.log(res);
                if (!res.result) {
                    throw new Error('Join Meeting Failed');
                }
                storeMeetingData(meetingId, res);
                // alert("join success");
                success();
                // navigate("/meeting/in");
            })
            .catch((err: any) => {
                console.log(err);
                alert(err.message);
            });
        setSpinning(false);
    };

    const storeMeetingData = (meetingId: number, res: any) => {
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
                <Content style={{ padding: '0 50px', margin: '16px 0', height: '100%' }}>
                    <Title style={{ margin: '16px 0' }}>○○システム</Title>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>会議</Breadcrumb.Item>
                        <Breadcrumb.Item>会議作成</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        className="site-layout-content"
                        style={{ background: '#fff', margin: '16px 0' }}
                    >
                        <Card
                            title="ミーティングを作成する"
                            bordered={false}
                            style={{ width: '100%', textAlign: 'center' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <p>ミーティングを作成するために、詳細設定で設定してください。</p>
                                <Row gutter={[16, 16]}>
                                    <Col span={8}></Col>
                                    <Col span={8}>
                                        <Space direction="vertical">
                                            <Row>
                                                <Space>
                                                    <span>会議名</span>
                                                    <Input
                                                        id="meetingName"
                                                        style={{ width: '135%' }}
                                                        placeholder="会議名を入力してください"
                                                    ></Input>
                                                </Space>
                                            </Row>
                                            <Row>
                                                <Space>
                                                    <span>開始時間</span>
                                                    <DatePicker
                                                        id="meetingDate"
                                                        style={{ width: '113%' }}
                                                        showTime
                                                        onChange={onChange}
                                                        onOk={onOk}
                                                        format="yyyy/MM/DD HH:mm:ss"
                                                    />
                                                </Space>
                                            </Row>
                                            {presenters.map((presenter, idx) => {
                                                return (
                                                    <Row key={'presenter' + idx}>
                                                        <Space>
                                                            <span>発表者</span>
                                                            <Input
                                                                id={'presenterId' + idx}
                                                                style={{
                                                                    width: '100%',
                                                                    textAlign: 'center',
                                                                }}
                                                                placeholder="発表者を入力してください"
                                                            ></Input>
                                                            <Button
                                                                onClick={onClickAdd}
                                                                type="primary"
                                                                icon={<PlusOutlined />}
                                                                size={'small'}
                                                            />
                                                            <Button
                                                                onClick={onClickRemove}
                                                                type="primary"
                                                                danger
                                                                icon={<MinusOutlined />}
                                                                size={'small'}
                                                            />
                                                        </Space>
                                                    </Row>
                                                );
                                            })}
                                        </Space>
                                    </Col>
                                    <Col span={8}></Col>
                                </Row>
                                <Button
                                    type="primary"
                                    style={{ width: '20%' }}
                                    onClick={createMeeting}
                                >
                                    ミーティングを作成する
                                </Button>
                                <Link to={'../meeting/join'}>
                                    <Button type="default" style={{ width: '20%' }}>
                                        キャンセル
                                    </Button>
                                </Link>
                            </Space>
                        </Card>
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
        </Spin>
    );
}
