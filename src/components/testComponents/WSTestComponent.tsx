import { useState, useEffect } from "react";
import Socket from "../../utils/webSocket";
import { sendMessage, receiveData, sendQuestion } from "../../utils/webSocketUtils";

const URL = process.env.REACT_APP_WEBSOCKET_URL;
const ws = new WebSocket(URL+"");
let socket = new Socket(ws);

export default function WSTestComponent() {
    const [socketData, setSocketData] = useState({message: "init"});

    function receive(e:any) {
        let data = receiveData(e.data);
        console.log(data);
    }
    useEffect(() => {
        console.log("socket on");
        socket.on("message", receive);
    }, []);

    function handleClick() {
        sendMessage(socket=socket, "Hello World");
    }

    return (
        <div>
            <h1>WebSocket Test</h1>
            <p>{socketData.message}</p>
            <button onClick={() => handleClick()}>Send</button>
        </div>
    );
}