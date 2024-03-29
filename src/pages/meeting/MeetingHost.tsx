import { Button, Row, DatePicker, Input, Space, Col, Spin, Modal } from 'antd';
import dayjs from 'dayjs';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/Pages.css';
import { useEffect, useState } from 'react';
import { meetingCreate } from '../../utils/api';
import { useSelector } from 'react-redux';
import { ConfigProvider } from 'antd';
import 'dayjs/locale/ja';
import jaJP from 'antd/lib/locale/ja_JP';

dayjs.locale('ja');

type Props = {
    setHostModalVisiable: (visiable: boolean) => void;
};

export default function MeetingHost(props: Props) {
    const navigate = useNavigate();

    const userid = useSelector((state: any) => state.userReducer.userid);

    useEffect(() => {
        if (userid === '') {
            navigate('/login');
        }
    }, []);

    const [spinning, setSpinning] = useState<boolean>(false);
    const [meetingName, setMeetingName] = useState<string>('');
    const [meetingDate, setMeetingDate] = useState<string>('');
    const [presenters, setPresenters] = useState<string[]>(['']);
    const [inputOk, setInputOk] = useState<boolean>(false);

    useEffect(() => {
        setInputOk(
            meetingName !== '' &&
                meetingDate !== '' &&
                meetingDate !== ':00' &&
                presenters.filter((id) => /^[\w]+$/.test(id)).length > 0
        );
    }, [meetingName, meetingDate, presenters]);

    const onChangeMeetingName = (e: any) => {
        setMeetingName(e.target.value);
    };

    const onChangeMeetingDate = (date: any, dateString: string) => {
        console.log('Selected Time: ', date);
        console.log('Formatted Selected Time: ', dateString + ':00');
        setMeetingDate(dateString + ':00');
    };

    const onClickAdd = (index: number) => {
        const newPresenters = presenters.slice();
        newPresenters.splice(index + 1, 0, '');

        setPresenters(newPresenters);
    };

    const onClickRemove = (index: number) => {
        if (presenters.length > 1) {
            const newPresenters = presenters.slice();
            newPresenters.splice(index, 1);
            setPresenters(newPresenters);
        }
    };

    const onChangePresenterId = (index: number, event: any) => {
        const newPresenters = presenters.slice();
        newPresenters[index] = event.target.value;
        setPresenters(newPresenters);
    };

    function error() {
        Modal.error({
            title: '会議が作成できませんでした',
            okText: '了解',
        });
    }

    function destoryAll() {
        Modal.destroyAll();
    }

    function success(meetingId: number) {
        Modal.success({
            title: '会議を作成しました',
            content: `会議ID: ${meetingId}`,
            okButtonProps: {
                onClick: () => {
                    // navigate('/meeting/in');
                    navigate('/meeting/join');
                    destoryAll();
                    props.setHostModalVisiable(false);
                },
            },
            okText: 'はい',
        });
    }

    const createMeeting = async () => {
        console.log('Create Meeting');
        const meetingName = (document.getElementById('meetingName') as HTMLInputElement).value;
        const meetingDate =
            (document.getElementById('meetingDate') as HTMLInputElement).value + ':00';
        const presenterIds = new Array<string>(presenters.length);

        for (let i = 0; i < presenterIds.length; i++) {
            presenterIds[i] = (
                document.getElementById('presenterId' + i) as HTMLInputElement
            ).value;
        }

        console.log(meetingName);
        console.log(meetingDate);
        console.log(presenterIds);

        setSpinning(true);

        await meetingCreate(meetingName, meetingDate, presenterIds)
            .then((res) => {
                console.log(res);
                if (!res.result) {
                    throw new Error('Meeting Create Failed');
                }
                // joinMeeting(res.meetingId);
                success(res.meetingId);
            })
            .catch((err) => {
                console.log(err);
                error();
                setSpinning(false);
            });
        setSpinning(false);
    };

    return (
        <Spin size="large" spinning={spinning}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <p style={{ margin: 'auto', textAlign: 'left' }}>会議情報を設定してください</p>
                <Row gutter={[16, 16]} style={{ margin: 'auto' }}>
                    <Col
                        span={6}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'right',
                        }}
                    >
                        会議名
                    </Col>
                    <Col span={12}>
                        <Input
                            id="meetingName"
                            style={{ width: '100%' }}
                            placeholder="会議名を入力"
                            onChange={onChangeMeetingName}
                        ></Input>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <ConfigProvider locale={jaJP}>
                        <Col
                            span={6}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'right',
                            }}
                        >
                            開始時間
                        </Col>
                        <Col span={12}>
                            <DatePicker
                                id="meetingDate"
                                style={{ width: '100%' }}
                                showTime
                                onChange={onChangeMeetingDate}
                                format="yyyy/MM/DD HH:mm"
                            />
                        </Col>
                    </ConfigProvider>
                </Row>
                {presenters.map((presenter, idx) => {
                    return (
                        <Row gutter={[16, 16]}>
                            <Col
                                span={6}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'right',
                                }}
                            >
                                {`発表者 ${idx + 1}`}
                            </Col>
                            <Col span={12}>
                                <Input
                                    id={'presenterId' + idx}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                    }}
                                    placeholder="ユーザーIDを入力"
                                    value={presenter}
                                    onChange={(e) => onChangePresenterId(idx, e)}
                                ></Input>
                            </Col>
                            <Col
                                span={1}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    onClick={() => onClickAdd(idx)}
                                    type="primary"
                                    ghost
                                    icon={<UserAddOutlined />}
                                    size={'small'}
                                />
                            </Col>
                            <Col
                                span={1}
                                style={{
                                    display: presenters.length === 1 && idx === 0 ? 'none' : 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    onClick={() => onClickRemove(idx)}
                                    type="default"
                                    danger
                                    icon={<UserDeleteOutlined />}
                                    size={'small'}
                                />
                            </Col>
                        </Row>
                    );
                })}
                <div className="button-container">
                    <Space direction="horizontal" className="button-container">
                        <Link to={'../meeting/join'}>
                            <Button
                                type="default"
                                onClick={() => props.setHostModalVisiable(false)}
                            >
                                キャンセル
                            </Button>
                        </Link>
                        <Button type="primary" onClick={createMeeting} disabled={!inputOk}>
                            作成
                        </Button>
                    </Space>
                </div>
            </Space>
        </Spin>
    );
}
