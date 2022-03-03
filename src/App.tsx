import './App.css';

import {BrowserRouter as Router,  Route, Routes } from 'react-router-dom';

// import TestPage from './pages/TestPage';
import LoginPage from './pages/user/loginPage';

function App() {
  return (
    // <div className="App">
      <Router>
        <Routes>
          {/* <Route path="/" element={<TestPage />} /> */}
          {/* <Route path="/test" element={<TestPage />} /> */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    // </div>
  );
}

export default App;
