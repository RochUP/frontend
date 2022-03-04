import './App.css';

import {BrowserRouter as Router,  Route, Routes } from 'react-router-dom';

import TestPage from './pages/TestPage';
import LoginPage from './pages/user/loginPage';
import RegisterPage from './pages/user/register';
import MeetingJoin from './pages/meeting/MeetingJoin';
import MeetingHost from './pages/meeting/MeetingHost';
import InMeeting from './pages/meeting/InMeeting';
import { Provider } from 'react-redux';
import store from './store';


function App() {
  return (
    <div className="App" >
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/test" element={<TestPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path='/meeting/join' element={<MeetingJoin />} />
            <Route path='/meeting/host' element={<MeetingHost />} />
            <Route path='/meeting/in' element={<InMeeting />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
