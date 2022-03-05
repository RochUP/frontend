import './App.css';
import { useState,useEffect } from "react";
import {BrowserRouter as Router,  Route, Routes } from 'react-router-dom';

import TestPage from './pages/TestPage';
import LoginPage from './pages/user/loginPage';
import RegisterPage from './pages/user/register';
import MeetingJoin from './pages/meeting/MeetingJoin';
import Chat from './pages/meeting/chat';
import Socket from "./utils/webSocket";

const URL = process.env.REACT_APP_WEBSOCKET_URL;
const ws = new WebSocket(URL+"");
let socket = new Socket(ws);

function App() {
  const [data, setData] = useState(
    {
        messageType: "question",
        userId: "test01",
        meetingId: 324,
        questionBody: "",
        documentId: 4,
        documentPage:3,
        questionTime:"2022-03-03 16:50:00"
      }
  );   
  function receiveData(e:any) {  
    setData(JSON.parse(e.data));
    console.log(data);    
  }
  useEffect(()=>{
    
    console.log("socket on");
    socket.on("message", receiveData); 

  },[])
  
  return (
    <div className="App" >
      <Router>
        <Routes>
          <Route path="/chat" element={<Chat socket={socket} data={data}/>} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path='/meeting/join' element={<MeetingJoin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
