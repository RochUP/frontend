
import { Button, Card, Col, Input, List, Tabs, Tooltip } from "antd";
import {
    CommentOutlined
} from '@ant-design/icons';
import "../../assets/css/Pages.css";
import moment from "moment";
import CommentItemComponent from "./CommentItemComponent"

import Socket from '../../utils/webSocket';
import Title from "antd/lib/typography/Title";

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
            questionBody: "",
            documentId: 0,
            documentPage: 0,
            questionTime: "",
        }
    }else{
        data = props.data;
    }

    const presenters = [
        "発表者1",
        "発表者2",
    ]
    const questionList = [
        [
            // presenters[0]への質問
            {
                userId: "test01",
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
                userId: "test01",
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
                userId: "test01",
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


    return (
        <div style={{ width:'100%' }}>
            <Col span={24} style={{ width:'100%' }}>
            <Card style={{ width: '100%', minHeight: 500, maxHeight: 500 }}>
                <Title level={5}>コメント一覧</Title>
                <Tabs defaultActiveKey="1">
                    {
                        questionList.map((questions, idx) => {
                            return (
                                <TabPane tab={presenters[idx]} key={"presenter"+idx} style={{maxHeight: 370, overflowY:'auto', overflowX:'hidden'}}>
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
                                            <li id={"comment"+idx} style={{maxWidth:'100%'}}>
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
                <Input placeholder="ここでコメントを書いてください" style={{width:'60%', marginLeft:'5%'}}></Input>
                <Button type="primary" icon={<CommentOutlined />} style={{width:'30%', textAlign:'center'}}>Comment</Button>
            </Col>
        </div>
    )

}