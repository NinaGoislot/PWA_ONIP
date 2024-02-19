import Home from './pages/Home';
import Test from './pages/Test'
import Simulation from './pages/Simulation'
import OneSimulation from './pages/OneSimulation'
import ConnectPhone from './pages/ConnectPhone'
import Game from './pages/Game'
import GameTest from './pages/GameTest'

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
            <Route path="/ConnectPhone" element={<ConnectPhone />} />
            <Route path="/Game" element={<Game />} />
            <Route path="/GameTest" element={<GameTest />} />
            <Route path="/Test" element={<Test />} />
            <Route path="/Simulation" element={<Simulation />} />
            <Route path="/Simulation/:id" element={<OneSimulation />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
   </div>
  )
}

export default App
