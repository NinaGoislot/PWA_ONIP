import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function Test() {
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });

    const handleOrientation = (event) => {
        console.log(event);
        const alpha = {alpha : 3};  // rotation autour de l'axe Z
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
        <main className="h-screen w-screen flex flex-col justify-around item-center bg-slate-700">
            <div className="flex justify-center items-center h-full">
                <Link to="/"><button className="bg-slate-400 h-20 p-8">Retourner à l'accueil</button></Link>
            </div>
            <div className="flex flex-col bg-slate-300 h-fit">
                {/* Afficher les données de l'orientation en permanence */}
                {orientationData && (
                    <div>
                        <p>Alpha: {orientationData.alpha}</p>
                        <p>Beta: {orientationData.beta}</p>
                        <p>Gamma: {orientationData.gamma}</p>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Test;
