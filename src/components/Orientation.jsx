import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Observer, observer } from 'mobx-react-lite';

function Orientation() {
    const [orientationData, setOrientationData] = useState({ alpha: 6, beta: 0, gamma: 0 });

    const handleOrientation = (event) => {
        console.log(event);
        const alpha = 3;  // rotation autour de l'axe Z
        const beta = event.beta;    // rotation autour de l'axe X
        const gamma = event.gamma;  // rotation autour de l'axe Y

        setOrientationData({ alpha, beta, gamma });
    };

    useEffect(() => {
        const setupOrientationListener = () => {
            if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', handleOrientation);
            } else {
                console.error("DeviceOrientation n'est pas supporté");
            }
        };

        setupOrientationListener();

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []); // Le tableau vide signifie que cela ne s'exécutera qu'une fois à l'initialisation

    return (
            <div className="flex flex-col bg-red-300 h-fit">
                {/* Afficher les données de l'orientation en permanence */}
                {orientationData && (
                    <div>
                        <p>Alpha: {orientationData.alpha}</p>
                        <p>Beta: {orientationData.beta}</p>
                        <p>Gamma: {orientationData.gamma}</p>
                    </div>
                )}
            </div>
    );
}

export default observer(Orientation);
