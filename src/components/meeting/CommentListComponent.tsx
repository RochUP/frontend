import { Button, Card, Col, Input, List, Select, Tooltip } from 'antd';
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
    sortMode: 'time' | 'likes';
    setSortMode: React.Dispatch<React.SetStateAction<'time' | 'likes'>>;
};

export default function CommentListComponent(props: Props) {
    const presenterIds = useSelector((state: any) => state.meetingReducer.presenterIds);
    const userId = useSelector((state: any) => state.userReducer.userid);
    const meetingId = useSelector((state: any) => state.meetingReducer.meetingId);
    const documentIds = useSelector((state: any) => state.meetingReducer.documentIds);
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);
    const questionList = useSelector((state: any) => state.meetingReducer.questionList);

    const indexnum = presenterIds.indexOf(props.presenterId);

    const [questionform, setquestion] = useState<string>('');

    function handleSendCommentClick() {
        setquestion(
            (document.getElementById('question' + props.presenterId) as HTMLInputElement).value
        );

        //documentIdの取得
        const documentId = documentIds[indexnum];

        //日付の取得
        var date = new Date();
        // var qtime = date.toLocaleString();

        const qyear = String(date.getFullYear());
        let qmonth = String(date.getMonth() + 1);
        let qday = String(date.getDate());
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

        setquestion('');
    }

    const setTime = (date: string) => {
        if (Number(date) < 10) {
            date = '0' + date;
        }
        return date;
    };

    const handleQuestionFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setquestion(e.target.value);
    };

    const changeDocumentPage = useCallback((page: number) => {
        store.dispatch(changeDocumentPageAction(props.presenterId, page));
    }, []);

    return (
        <div style={{ width: '100%' }}>
            <Col span={24} style={{ width: '100%' }}>
                <Card
                    title="コメント一覧"
                    extra={
                        <Select
                            defaultValue={props.sortMode}
                            onChange={(mode: 'time' | 'likes') => {
                                props.setSortMode(mode);
                            }}
                            style={{ width: '100px' }}
                        >
                            <Select.Option value="time">時間順</Select.Option>
                            <Select.Option value="likes">いいね順</Select.Option>
                        </Select>
                    }
                    style={{ width: '100%', minHeight: 500, maxHeight: 500, textAlign: 'center' }}
                >
                    {!(questionList.length === 0) && (
                        <List
                            className="comment-list"
                            itemLayout="horizontal"
                            dataSource={questionList[indexnum].map((question: any, _: number) => {
                                return {
                                    id: question.questionId,
                                    content: (
                                        <Tooltip title={`P.${question.documentPage}へのコメント`}>
                                            <p
                                                onClick={() =>
                                                    changeDocumentPage(question.documentPage)
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
                            })}
                            style={{
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                textAlign: 'left',
                                maxHeight: '400px',
                            }}
                            renderItem={(item: any, _: number) => (
                                <li id={item.questionId} style={{ maxWidth: '100%' }}>
                                    <CommentItemComponent socket={props.socket} question={item} />
                                </li>
                            )}
                        />
                    )}
                </Card>
            </Col>
            <Col span={24} style={{ padding: '8px', margin: '8px' }}>
                <Input.Group compact>
                    <Input
                        placeholder={`資料P.${documentPageNow}にコメントを送信する`}
                        style={{ width: 'calc(100% - 50px)' }}
                        id={'question' + props.presenterId}
                        value={questionform}
                        onChange={handleQuestionFormChange}
                        onPressEnter={handleSendCommentClick}
                    ></Input>
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        style={{ width: '50px' }}
                        onClick={() => {
                            handleSendCommentClick();
                        }}
                        disabled={questionform === ''}
                    />
                </Input.Group>
            </Col>
        </div>
    );
}
