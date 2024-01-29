import Home from './pages/Home';
import Test from './pages/Test';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createContext } from 'react';
import React from 'react';
import { store } from './store/store';


export const GlobalContext = createContext();

function App() {

  return (
   <div className="App">
    <GlobalContext.Provider value={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Test" element={<Test />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
   </div>
  )
}

export default App
