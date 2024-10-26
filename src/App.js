import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Quiz from './Quiz';
import Notes from './Notes';
import MemoryGame from './Memory';

const App = () => {
  return (
 
      
   <Router>
    
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/quiz/:category" element={<Quiz />} />
     <Route path="/memory/:category" element={<MemoryGame />} />
     <Route path="/Notes/:category" element={<Notes />} />
      
   </Routes>
       </Router>
   
  );
};

export default App;


 