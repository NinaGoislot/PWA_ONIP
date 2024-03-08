import Home from './pages/Home';
import Test from './pages/Test'
import Simulation from './pages/Simulation'
import OneSimulation from './pages/OneSimulation'
import ConnectPhone from './pages/ConnectPhone'
import ConnectTest from './pages/ConnectTest'
import Wait from './pages/Wait'
import SwipePage from './pages/SwipePage'
import WaitFictive from './pages/WaitFictive'
import Game from './pages/Game'
import GameTest from './pages/GameTest'
import Cabinet from './pages/Cabinet'
import PourBottle from './pages/PourBottle'
import Serve from './pages/Serve'
import Options from './pages/Options'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createContext } from 'react';
import React, { useContext, useEffect, useState } from "react";
import { store } from './store/store';

export const GlobalContext = createContext();
function App() {

  // useEffect(() => {
  //   let startY = 0;

  //   const handleTouchStart = (event) => {
  //     startY = event.touches[0].clientY;
  //   };

  //   const handleTouchMove = (event) => {
  //     const currentY = event.touches[0].clientY;
  //     const deltaY = currentY - startY;

  //     // Empêcher le rafraîchissement de la page si le défilement est vers le bas
  //     if (deltaY > 0) {
  //       event.preventDefault();
  //     }
  //   };
 
  //   document.addEventListener('touchstart', handleTouchStart, { passive: true });
  //   document.addEventListener('touchmove', handleTouchMove, { passive: false });

  //   return () => {
  //     document.removeEventListener('touchstart', handleTouchStart);
  //     document.removeEventListener('touchmove', handleTouchMove);
  //   };
  // }, []);

  return (
    <div className="App">
      <GlobalContext.Provider value={store}>
        <BrowserRouter basename="/PWA">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="ConnectPhone" element={<ConnectPhone />} />
            <Route path="Wait" element={<Wait />} />
            <Route path="WaitFictive" element={<WaitFictive />} />
            <Route path="Game" element={<Game />} />
            <Route path="SwipePage" element={<SwipePage />} />
            <Route path="/GameTest" element={<GameTest />} />
            <Route path="/Cabinet" element={<Cabinet />} />
            <Route path="/PourBottle" element={<PourBottle />} />
            <Route path="/Serve" element={<Serve />} />
            <Route path="/Options" element={<Options />} />

            <Route path="ConnectTest" element={<ConnectTest />} />
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
