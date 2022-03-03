import Socket from "../utils/webSocket";

export default function WSTestComponent() {
    let socket_data: object = {};

    const URL = process.env.REACT_APP_WEBSOCKET_URL;
    // const ws = new WebSocket(URL+"/");
    // let socket = new Socket(ws);

    // socket.on("data", receiveData);
    function receiveData(e:any) {
        let data = JSON.parse(e.data);
        console.log(data);
        socket_data = data;
    }

    function handleClick() {
        // socket.emit(({message: "Hello"}));
    }

    return (
        <div>
            <h1>WebSocket Test</h1>
            {/* <p>{socket_data}</p> */}
            <button onClick={() => (handleClick)}>Send</button>
        </div>
    );
}