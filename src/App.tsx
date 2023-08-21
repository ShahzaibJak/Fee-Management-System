import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar/navbar';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { CreateStudent } from './pages/create-post/create-student';
import { SearchStudent } from './pages/search-student/search-student';
import { GenerateChallan } from './pages/generate-challan/generate-challan';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create-student' element={<CreateStudent />} />
          <Route path='/search-student' element={<SearchStudent />} />
          <Route path='/generate-challan' element={<GenerateChallan />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
