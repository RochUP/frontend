import { useState,useEffect } from "react";
import Socket from "../../utils/webSocket";


// export function sendQuestion(messagetype:string,question:string){
//     let message = 
// }
type ChatProps = {
    socket:Socket;
    data:any;
}

export default function Chat(props:ChatProps) {

    const [question, setquestion] = useState<string>('');
    const [questionlist, setquestionlist] = useState<string[]>([])

    // const URL = process.env.REACT_APP_WEBSOCKET_URL;
    // const ws = new WebSocket(URL+"");
    // let socket = new Socket(ws);
    // socket.on("message", receiveData);

    useEffect (() => {
        console.log("ques add");
        setquestionlist([...questionlist, props.data.message]);
    }, [props.data]);

    function handleClick() {
        let message = {
            messagetype: "message",
            message: "Hello",
            question: ""
        }

        message.message = question
        const data = JSON.stringify(message);
        console.log(data);
        props.socket.emit(data);
        setquestion('');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        // message = (document.getElementById("question"));
        setquestion(e.target.value);
        // console.log(question);
    }

    return (
        <div>
            <h1>WebSocket Test</h1>
            <p>{props.data.question}</p>
            {questionlist.map((question, idx)=>{
                return(
                    <p key={"question"+idx}>{question}</p>
                )
            })}
            <input type="text" onChange={handleChange} value={question}/>
            <button onClick={() => handleClick()}>Send</button>
        </div>
    );
}