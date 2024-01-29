import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Orientation from "../components/Orientation";

function Test() {
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
        <main className="h-screen w-screen flex flex-col justify-around item-center bg-slate-700">
            <div className="flex justify-center items-center h-full">
                <Link to="/"><button className="bg-slate-400 h-20 p-8">Retourner à l'accueil</button></Link>
            </div>
            <Orientation/>
        </main>
    );
}

export default observer(Test);
