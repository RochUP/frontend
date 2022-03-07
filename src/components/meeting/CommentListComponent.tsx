
import { Breadcrumb, Button, Card, Col, Divider, Input, Layout, List, Menu, Row, Tabs, Comment, Tooltip } from "antd";
import {
    UserOutlined,
    ArrowUpOutlined,
    CommentOutlined,
    LikeOutlined,
    LikeFilled
} from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import { Typography } from 'antd';
import "../../assets/css/Pages.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { createElement, useEffect, useState } from "react";
import CommentItemComponent from "./CommentItemComponent"

import Socket from '../../utils/webSocket';
import { getDocument } from "../../utils/api";
import { sendQuestion } from "../../utils/webSocketUtils";
import { useSelector } from 'react-redux';

const { TabPane } = Tabs;


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

    // const presenters = [
    //     "発表者1",
    //     "発表者2",
    // ]

    const presenters = useSelector((state: any) => state.meetingReducer.presenterNames);
    const presenterIds = useSelector((state: any)=> state.meetingReducer.presenterIds);
    const userId = useSelector((state: any) => state.userReducer.userid);
    const meetingId = useSelector((state: any) => state.meetingReducer.meetingId);

    const [questionList, updateQuestionList] = useState([
        [
            // presenters[0]への質問
            {
                // userId: "test01",
                meetingId: 324,
                questionId: 1,
                questionBody: "good!",
                documentId: 4,
                documentPage:3,
                questionTime:"2022/03/03 16:50:00",
                voteNum: 1,
                isVote: true,
            },
            {
                // userId: "test01",
                meetingId: 324,
                questionId: 2,
                questionBody: "good!",
                documentId: 4,
                documentPage:3,
                questionTime:"2022/03/03 16:50:00",
                voteNum: 3,
                isVote: false,
            },
        ],
        [
            // presenters[1]への質問
            {
                // userId: "test01",
                meetingId: 324,
                questionId: 2,
                questionBody: "good!",
                documentId: 4,
                documentPage:3,
                questionTime:"2022/03/03 16:50:00",
                voteNum: 2,
                isVote: true,
            },
        ],
    ]
    )
    // const [questionlist,updateQuestionList] = useState<{
    //     userId: "",
    //     meetingId: 324,
    //     questionId: 1,
    //     questionBody: "good!",
    //     documentId: 4,
    //     documentPage:3,
    //     questionTime:"",
    //     voteNum: 0,
    //     isVote: false,
    // }>();

    useEffect(()=>{
        let question =
        {
            // userId: "test01",
            meetingId: 324,
            questionId: 1,
            questionBody: "test!",
            documentId: 4,
            documentPage:3,
            questionTime:"2022/03/03 16:50:00",
            voteNum: 0,
            isVote: false,
        }
        console.log("ques add");
        console.log(data)

        question.questionBody = data.questionBody
        question.questionTime = data.questionTime

        // questionList = questionList[0].push(props.data.questionBody)
        //発表者のind0exにquestionを追加
        // questionList[0].push(props.data);
        if (props.data){

            //発表者が何番目であるかを取得

            let presenterId = data.presenterId
            //presenterIdを変える必要あり
            let indexnum = presenterIds.indexOf('yoshida1')
            //現時点ではpresenterIdがないので仮に1にしている
            // indexnum=1
            let copy = [...questionList];
            copy[indexnum].push(question)
            updateQuestionList(copy)
        }

    },[props.data]);

    const [questionform, setquestion] = useState<string>('');//質問チャットを書き込む用

    function handleClick() {
        // let message={"messagetype":"question","userId":userId,"meetingId":meetingId,"questionBody":question,"documentId":documentId,"documentpages":documentpages,"questionTime"}
        
        // let question = (document.getElementById("question")as HTMLInputElement).value;
        setquestion((document.getElementById("question")as HTMLInputElement).value);

        //日付の取得
        var date = new Date();
        var qtime = date.toLocaleString();

        sendQuestion(props.socket, userId, meetingId, questionform, 4, 1, qtime)

        //書き込み欄のクリア
        setquestion('');
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setquestion(e.target.value);
        // console.log(questionform);
    }

    return (
        <div>
            <Col span={24}>
            <Card style={{ width: '100%', minHeight: 481, maxHeight: 500 }}>
                <Tabs defaultActiveKey="1">
                    {
                        questionList.map((questions, idx) => {
                            return (
                                <TabPane tab={presenters[idx]} key={"presenter"+idx} style={{maxHeight: 370, overflow:'scroll', overflowX:'hidden'}}>
                                    <List
                                        className="comment-list"
                                        itemLayout="horizontal"
                                        dataSource={
                                            questions.map((question, idx) => {
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
                                        renderItem={(item, idx)=> (
                                            <li id={"comment"+idx}>
                                                <CommentItemComponent question={item}/>
                                            </li>
                                        )}
                                    />
                                </TabPane>
                            )
                        })
                    }
                </Tabs>
            </Card>
            </Col>
            <Col span={24} style={{padding:"8px 0", margin:'8px'}}>
                <Input placeholder="ここでコメントを書いてください" style={{width:'70%', marginLeft:'5%'}} id="question" value={questionform} onChange={handleChange}></Input>
                <Button type="primary" icon={<CommentOutlined />} style={{width:'20%'}} onClick={()=>{handleClick()}}>Comment</Button>
            </Col>
        </div>
    )

}