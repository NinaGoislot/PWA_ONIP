import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../App.jsx';
import { Link } from 'react-router-dom';

function Test() {
    
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });

    useEffect(() => {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
        } else {
            console.error("DeviceOrientation n'est pas supporté");
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    function handleOrientation(event) {
        const alpha = event.alpha;  // rotation autour de l'axe Z
        const beta = event.beta;    // rotation autour de l'axe X
        const gamma = event.gamma;  // rotation autour de l'axe Y

        console.log(orientationData);

        setOrientationData({ alpha, beta, gamma });
    }

    return (
        <main className="h-screen w-screen flex flex-col justify-around item-center bg-slate-700">
            <div className="flex justify-center items-center h-full">
                    <Link to="/"><button className="bg-slate-400 h-20 p-8">Retourner a l'accueil </button></Link>
            </div>
            <div className="flex flex-col bg-slate-300 h-fit">
                {orientationData && (
                    <div>
                        <p>Alpha: {orientationData.alpha}</p>
                        <p>Beta: {orientationData.beta}</p>
                        <p>Gamma: {orientationData.gamma}</p>
                    </div>
                )}
            </div>
        </main>
    )
}
export default Test;