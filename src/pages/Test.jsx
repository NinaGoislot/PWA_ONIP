import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

function Test() {
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });

    const [dataX, setBestDataX] = useState(0);
    const [dataY, setBestDataY] = useState(0);
    const [dataZ, setBestDataZ] = useState(0);

    const [dataX2, setBestDataX2] = useState(0);
    const [dataY2, setBestDataY2] = useState(0);
    const [dataZ2, setBestDataZ2] = useState(0);


    /*const handleOrientation = (event) => {
        console.log(event);
        const alpha = event.alpha;  // rotation autour de l'axe Z
        const beta = event.beta;    // rotation autour de l'axe X
        const gamma = event.gamma;  // rotation autour de l'axe Y

        setOrientationData({ alpha, beta, gamma });
    };*/

    const handleOrientation = (event) => {
        console.log("ORIENTATION : ",event);
        const { alpha, beta, gamma } = event;
        setOrientationData({ alpha, beta, gamma });
    };

    const handleMotion = (event) => {
        console.log("MOTION: ",event);
        const { acceleration, rotationRate } = event;
        setMotionData({ acceleration, rotationRate });

        if (event.acceleration.x > dataX) {setBestDataX(event.acceleration.x)};
        if (event.acceleration.y > dataY) {setBestDataY(event.acceleration.y)};
        if (event.acceleration.z > dataZ) {setBestDataZ(event.acceleration.z)};

        event.acceleration.x < dataX2 ? setBestDataX2(event.acceleration.x) : "";
        event.acceleration.y < dataY2 ? setBestDataY2(event.acceleration.y) : "";
        event.acceleration.z < dataZ2 ? setBestDataZ2(event.acceleration.z) : "";
    };

    useEffect(() => {
        const setupOrientationListener = () => {
            if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', handleOrientation);
            } else {
                console.error("DeviceOrientation n'est pas supporté");
            }
        };

        const setupMotionListener = () => {
            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion', handleMotion);
            } else {
                console.error("DeviceMotion n'est pas supporté");
            }
        };

        setupOrientationListener();
        setupMotionListener();

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, []); // Le tableau vide signifie que cela ne s'exécutera qu'une fois à l'initialisation

    return (
        <main className="h-screen w-screen flex flex-col justify-around item-center bg-slate-700">
            <div className="flex justify-center items-center h-full">
                <Link to="/"><button className="bg-slate-400 h-20 p-8">Retourner à l'accueil</button></Link>
            </div>
            <div className="flex flex-col justify-center items-center h-full">
                <div className="flex justify-auround py-4">
                    <p>Point culminant Positif en X : {dataX}</p>
                    <p>Point culminant Positif en Y : {dataY}</p>
                    <p>Point culminant Positif en Z : {dataZ}</p>
                </div>
                <div className="flex justify-auround py-4">
                    <p>Point culminant Négatif en X : {dataX2}</p>
                    <p>Point culminant Négatif en Y : {dataY2}</p>
                    <p>Point culminant Négatif en Z : {dataZ2}</p>
                </div>
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
            <div className="flex flex-col bg-red-300 h-fit">
                {/* Afficher les données d'accélération en permanence */}
                {motionData && (
                     <div>
                     <p>Acceleration X: {motionData.acceleration.x}</p>
                     <p>Acceleration Y: {motionData.acceleration.y}</p>
                     <p>Acceleration Z: {motionData.acceleration.z}</p>
                     <p>Rotation Rate Alpha: {motionData.rotationRate.alpha}</p>
                     <p>Rotation Rate Beta: {motionData.rotationRate.beta}</p>
                     <p>Rotation Rate Gamma: {motionData.rotationRate.gamma}</p>
                 </div>
                )}
            </div>
        </main>
    );
}

export default observer(Test);
