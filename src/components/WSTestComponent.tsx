import onSocketConnect from "../utils/webSocket";

export default function WSTestComponent() {
    const socket = onSocketConnect();

    return (
        <div>
            <h1>WebSocket Test</h1>
            <p>{socket.message}</p>
        </div>
    );
}