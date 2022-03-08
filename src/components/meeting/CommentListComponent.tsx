
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
}


export default function CommentListComponent(props: Props) {
    let data: any;
    if (!props.data){
        // nullだった場合適当な初期値を入れる（必要ないかも）
        data = {
            meetingId: 0,
            questionId: 0,
            questionBody: "",
            documentId: 0,
            documentPage: 0,
            questionTime: "",
        }
    }else{
        data = props.data;
    }

    const presenters = useSelector((state: any) => state.meetingReducer.presenterNames);
    const presenterIds = useSelector((state: any)=> state.meetingReducer.presenterIds);
    const userId = useSelector((state: any) => state.userReducer.userid);
    const meetingId = useSelector((state: any) => state.meetingReducer.meetingId);
    const presenterIdNow = useSelector((state: any) => state.meetingReducer.presenterIdNow);
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);
    
    const [questionList,updateQuestionList] = useState(Array(presenters.length).fill(null).map(e=>(new Array())))


    useEffect(()=>{
        let question =
        {
            meetingId: 0,
            questionId: 0,
            questionBody: "!",
            documentId: 0,
            documentPage: 0,
            questionTime:"",
            voteNum: 0,
            isVote: false,
        }
        console.log("ques add");
        console.log(data);

        question.questionBody = data.questionBody;
        question.questionTime = data.questionTime;
        question.documentId = data.documentId;
        question.documentPage = data.documentPage;
        question.questionId = data.questionId;

        //発表者のind0exにquestionを追加
        if (props.data){

            //発表者が何番目であるかを取得

            let presenterId = data.presenterId;
            //presenterIdを変える必要あり
            let indexnum = presenterIds.indexOf(presenterId);
            //現時点ではpresenterIdがないので仮に1にしている
            // indexnum=1
            let copy = [...questionList];
            copy[indexnum].push(question);
            updateQuestionList(copy);
        }

    },[props.data]);

    const [questionform, setquestion] = useState<string>('');//質問チャットを書き込む用



    function handleClick() {
        setquestion((document.getElementById("question")as HTMLInputElement).value);

        //documentIdの取得
        let indexnum = presenterIds.indexOf(presenterIdNow);
        let documentId = indexnum

        //日付の取得
        var date = new Date();
        var qtime = date.toLocaleString();

        sendQuestion(props.socket, userId, meetingId, questionform, documentId, documentPageNow, qtime)

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
                            questionList[0].map((question:any, idx:number) => {
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
                <Input placeholder="ここでコメントを書いてください" style={{width:'60%', marginLeft:'5%'}} id="question" value={questionform} onChange={handleChange}></Input>
                <Button type="primary" icon={<CommentOutlined />} style={{width:'30%'}} onClick={()=>{handleClick()}}>Comment</Button>
            </Col>
        </div>
    )

}