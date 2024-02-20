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
            <Route path="/PWA/" element={<Home />} />
            <Route path="/PWA/ConnectPhone" element={<ConnectPhone />} />
            <Route path="/PWA/Game" element={<Game />} />
            <Route path="/PWA/GameTest" element={<GameTest />} />
            <Route path="/PWA/Test" element={<Test />} />
            <Route path="/PWA/Simulation" element={<Simulation />} />
            <Route path="/PWA/Simulation/:id" element={<OneSimulation />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
   </div>
  )
}

export default App
