import { Button, Card, Col, Input, List, Tooltip } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import '../../assets/css/Pages.css';
import CommentItemComponent from './CommentItemComponent';

import Socket from '../../utils/webSocket';
import store from '../../store';
import { changeDocumentPageAction } from '../../actions/meetingActions';

import { sendQuestion } from '../../utils/webSocketUtils';
import { useSelector } from 'react-redux';

import { useCallback, useState } from 'react';
import moment from 'moment';

type Props = {
    socket: Socket;
    data: any;
    presenterId: string;
};

export default function CommentListComponent(props: Props) {
    const presenterIds = useSelector((state: any) => state.meetingReducer.presenterIds);
    const userId = useSelector((state: any) => state.userReducer.userid);
    const meetingId = useSelector((state: any) => state.meetingReducer.meetingId);
    const documentIds = useSelector((state: any) => state.meetingReducer.documentIds);
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);

    const questionList = useSelector((state: any) => state.meetingReducer.questionList);

    const [questionform, setquestion] = useState<string>(''); //質問チャットを書き込む用

    function handleClick() {
        setquestion(
            (document.getElementById('question' + props.presenterId) as HTMLInputElement).value
        );

        //documentIdの取得
        let indexnum = presenterIds.indexOf(props.presenterId);
        let documentId = documentIds[indexnum];

        //日付の取得
        var date = new Date();
        // var qtime = date.toLocaleString();

        const qyear = String(date.getFullYear());
        let qmonth = String(date.getMonth() + 1);
        let qday = String(date.getDay());
        let qhours = String(date.getHours());
        let qminutes = String(date.getMinutes());
        let qseconds = String(date.getSeconds());

        qmonth = setTime(qmonth);
        qday = setTime(qday);
        qhours = setTime(qhours);
        qminutes = setTime(qminutes);
        qseconds = setTime(qseconds);

        const qtime =
            qyear + '/' + qmonth + '/' + qday + ' ' + qhours + ':' + qminutes + ':' + qseconds;

        sendQuestion(
            props.socket,
            userId,
            meetingId,
            questionform,
            documentId,
            documentPageNow,
            qtime
        );

        //書き込み欄のクリア
        setquestion('');
    }

    const setTime = (date: string) => {
        if (Number(date) < 10) {
            date = '0' + date;
        }
        return date;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setquestion(e.target.value);
    };

    const changeDocumentPage = useCallback((presenterId: number, page: number) => {
        store.dispatch(changeDocumentPageAction(presenterId, page));
    }, []);

    return (
        <div style={{ width: '100%' }}>
            <Col span={24} style={{ width: '100%' }}>
                <Card
                    title="コメント一覧"
                    style={{ width: '100%', minHeight: 500, maxHeight: 500, textAlign: 'center' }}
                >
                    <List
                        className="comment-list"
                        itemLayout="horizontal"
                        dataSource={questionList[presenterIds.indexOf(props.presenterId)].map(
                            (question: any, _: number) => {
                                return {
                                    id: question.questionId,
                                    content: (
                                        <Tooltip title={`P.${question.documentPage}へのコメント`}>
                                            <p
                                                onClick={() =>
                                                    changeDocumentPage(
                                                        question.presenterId,
                                                        question.documentPage
                                                    )
                                                }
                                            >
                                                {question.questionBody}
                                            </p>
                                        </Tooltip>
                                    ),
                                    datetime: (
                                        <span>
                                            {moment(question.questionTime).format(
                                                'YYYY年MM月DD日 HH時mm分ss秒'
                                            )}
                                        </span>
                                    ),
                                    like: question.voteNum,
                                    isLiked: question.isVote,
                                };
                            }
                        )}
                        style={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            textAlign: 'left',
                            maxHeight: '400px',
                        }}
                        renderItem={(item: any, idx: number) => (
                            <li id={'comment' + idx} style={{ maxWidth: '100%' }}>
                                <CommentItemComponent socket={props.socket} question={item} />
                            </li>
                        )}
                    />
                </Card>
            </Col>
            <Col span={24} style={{ padding: '8px', margin: '8px' }}>
                <Input.Group compact>
                    <Input
                        placeholder={`資料P.${documentPageNow}にコメントを送信する`}
                        style={{ width: 'calc(100% - 50px)' }}
                        id={'question' + props.presenterId}
                        value={questionform}
                        onChange={handleChange}
                    ></Input>
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        style={{ width: '50px' }}
                        onClick={() => {
                            handleClick();
                        }}
                        disabled={questionform === ''}
                    />
                </Input.Group>
            </Col>
        </div>
    );
}
