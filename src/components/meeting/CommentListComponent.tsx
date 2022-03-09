
import { Button, Card, Col, Input, List, Tooltip } from "antd";
import {
    CommentOutlined
} from '@ant-design/icons';
import "../../assets/css/Pages.css";
import moment from "moment";
import CommentItemComponent from "./CommentItemComponent"

import Socket from '../../utils/webSocket';

import { sendQuestion } from "../../utils/webSocketUtils";
import { useSelector } from 'react-redux';

import { useEffect, useState } from "react";

// type SocketData = {
//     messageType: string;
//     meetingId: number;
//     questionBody: string;
//     documentId: number;
//     documentPage: number;
//     questionTime: string;
// }

type Props = {
    socket: Socket;
    data: any;
    presenterId: string;
}

export default function CommentListComponent(props: Props) {

    const presenterIds = useSelector((state: any)=> state.meetingReducer.presenterIds);
    const userId = useSelector((state: any) => state.userReducer.userid);
    const meetingId = useSelector((state: any) => state.meetingReducer.meetingId);
    const documentIds = useSelector((state: any) => state.meetingReducer.documentIds);
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);
    
    const questionList = useSelector((state: any) => state.meetingReducer.questionList);

    const [questionform, setquestion] = useState<string>('');//質問チャットを書き込む用

    function handleClick() {
        setquestion((document.getElementById("question"+props.presenterId)as HTMLInputElement).value);

        //documentIdの取得
        let indexnum = presenterIds.indexOf(props.presenterId);
        let documentId = documentIds[indexnum];

        //日付の取得
        var date = new Date();
        var qtime = date.toLocaleString();

        sendQuestion(props.socket, userId, meetingId, questionform, documentId, documentPageNow, qtime);

        //書き込み欄のクリア
        setquestion('');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setquestion(e.target.value);
        // console.log(questionform);
    }

    return (
        <div style={{ width:'100%' }}>
            <Col span={24} style={{ width:'100%' }}>
                <Card title="コメント一覧" style={{ width: '100%', minHeight: 500, maxHeight: 500, textAlign:'center' }}>
                    <List
                        className="comment-list"
                        itemLayout="horizontal"
                        dataSource={
                            questionList[presenterIds.indexOf(props.presenterId)].map((question:any, idx:number) => {
                                return(
                                    {
                                        id: question.questionId,
                                        author: '匿名',
                                        content: (<p>{question.questionBody}</p>),
                                        datetime: (
                                            <Tooltip title={question.questionTime}>
                                                <span>{moment(question.questionTime).fromNow()}</span>
                                            </Tooltip>
                                        ),
                                        like: question.voteNum,
                                        isLiked: question.isVote,
                                    }
                                )
                            })
                        }
                        style={{overflowY:'auto', overflowX:'hidden', textAlign:'left'}}
                        renderItem={(item:any, idx:number)=> (
                            <li id={"comment"+idx} style={{maxWidth:'100%'}}>
                                <CommentItemComponent question={item}/>
                            </li>
                        )}
                    />
                </Card>
            </Col>
            <Col span={24} style={{padding:"8px 0", margin:'8px'}}>
                <Input placeholder="ここでコメントを書いてください" style={{width:'60%', marginLeft:'5%'}} id={"question"+props.presenterId} value={questionform} onChange={handleChange}></Input>
                <Button type="primary" icon={<CommentOutlined />} style={{width:'30%'}} onClick={()=>{handleClick()}}>Comment</Button>
            </Col>
        </div>
    )

}