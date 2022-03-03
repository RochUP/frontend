import { useState } from "react";
import Socket from "../utils/webSocket";

export default function WSTestComponent() {
    const [socketData, setSocketData] = useState({message: "init"});

    const URL = process.env.REACT_APP_WEBSOCKET_URL;
    const ws = new WebSocket(URL+"");
    let socket = new Socket(ws);

    socket.on("message", receiveData);
    function receiveData(e:any) {
        let data = JSON.parse(e.data);
        console.log(data);
        setSocketData(data);
    }

    function handleClick() {
        let message = {
            messagetype: "message",
            message: "Hello"
        }
        const data = JSON.stringify(message);
        console.log(data);
        socket.emit(data);
    }

    return (
        <div>
            <h1>WebSocket Test</h1>
            <p>{socketData.message}</p>
            <button onClick={() => handleClick()}>Send</button>
        </div>
    );
}