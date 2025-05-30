import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import newUser from './newUser';

function useRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/newUser" element={<newUser />} />
      </Routes>
    </Router>
  );
}

export default useRouter;