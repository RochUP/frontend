import { useState,useEffect } from "react";
import Socket from "../../utils/webSocket";
import ChatItem from "./chatItem"

type ChatProps = {
    socket:Socket;
    data:any;
}

var presenterList: string[] = new Array(0);

export default function Chat(props:ChatProps) {

    const [question, setquestion] = useState<string>('');//質問チャットを書き込む用
    const [questionlists, setquestionlist] = useState<string[]>([])//これまでの質問チャットを保持する用

    useEffect (() => {
        console.log("ques add");
        setquestionlist([...questionlists, props.data.questionBody]);
    }, [props.data]);

    function handleClick() {
        // let message={"messagetype":"question","userId":userId,"meetingId":meetingId,"questionBody":question,"documentId":documentId,"documentpages":documentpages,"questionTime"}
        
        //日付の取得
        var date = new Date();
        var qtime = date.toLocaleString();

        let message =
        {
            messageType: "question",
            userId: "test01",
            meetingId: 324,
            questionBody: "",
            documentId: 4,
            documentPage:3,
            questionTime:"2022/03/03 16:50:00"
        }

        message.questionBody = question;
        message.questionTime = qtime;
        const data = JSON.stringify(message);
        console.log(data);
        props.socket.emit(data);

        //書き込み欄のクリア
        setquestion('');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setquestion(e.target.value);
        // console.log(question);
    }

    return (
        <div>
            <h1>WebSocket Test</h1>
            {/* {questionlists.map((question, idx)=>{
                return(
                    <p key={"question"+idx}>{question}</p>
                )
            })} */}
            <ChatItem questionlists={questionlists}/>
            <input type="text" onChange={handleChange} value={question}/>
            <button onClick={() => handleClick()}>Send</button>
        </div>
    );
}