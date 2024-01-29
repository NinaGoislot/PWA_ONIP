import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function Test() {
    const [orientationValues, setOrientationValues] = useState({
        alpha: null,
        beta: null,
        gamma: null,
      });
    
      const handleOrientation = (event) => {
        const alpha = event.alpha;  // rotation autour de l'axe Z
        const beta = event.beta;    // rotation autour de l'axe X
        const gamma = event.gamma;  // rotation autour de l'axe Y
    
        setOrientationValues({ alpha, beta, gamma });
      };
    
      useEffect(() => {
        const setupOrientationListener = () => {
          if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            console.error("DeviceOrientation n'est pas supporté");
          }
        };
    
        document.addEventListener('DOMContentLoaded', setupOrientationListener);
    
        return () => {
          // Cleanup: remove event listener when component unmounts
          window.removeEventListener('deviceorientation', handleOrientation);
        };
      }, []); // Empty dependency array means this effect runs once after the initial render
    
      return (
        <div>
          <p>Alpha: {orientationValues.alpha}</p>
          <p>Beta: {orientationValues.beta}</p>
          <p>Gamma: {orientationValues.gamma}</p>
        </div>
      );
    };

export default Test;
