import './App.css';

import {BrowserRouter as Router,  Route, Routes } from 'react-router-dom';

import TestPage from './pages/TestPage';
import LoginPage from './pages/user/loginPage';
import RegisterPage from './pages/user/register';
import MeetingJoin from './pages/meeting/MeetingJoin';

function App() {
  return (
    <div className="App" >
      <Router>
        <Routes>
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
