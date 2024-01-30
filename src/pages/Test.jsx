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

        setBestDataX2((prevX2) => formatAndCompare(acceleration.x, prevX2));
        setBestDataY2((prevY2) => formatAndCompare(acceleration.y, prevY2));
        setBestDataZ2((prevZ2) => formatAndCompare(acceleration.z, prevZ2));
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

    const formatAndCompare = (value, prevValue) => {
        const formattedValue = value !== undefined ? value.toFixed(2) : prevValue;
        return value < prevValue ? formattedValue : prevValue;
      };

    return (
        <main className="h-screen w-screen flex flex-col justify-around item-center bg-slate-700">
            <div className="flex justify-center items-center h-full">
                <Link to="/"><button className="bg-slate-400 h-20 p-8">Retourner à l'accueil</button></Link>
            </div>
            <div className="flex flex-col justify-center items-center h-full">
                <div className="flex justify-auround py-4 text-white">
                    <p>Point culminant Positif en X : {dataX}</p>
                    <p>Point culminant Positif en Y : {dataY}</p>
                    <p>Point culminant Positif en Z : {dataZ}</p>
                </div>
                <div className="flex justify-auround py-4 text-white">
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


{/* import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Modal from '../components/Modal';

function Test() {
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
    const [simulationStart, setSimulation] = useState(false);

    const [dataX, setBestDataX] = useState(0);
    const [dataY, setBestDataY] = useState(0);
    const [dataZ, setBestDataZ] = useState(0);

    const [dataX2, setBestDataX2] = useState(0);
    const [dataY2, setBestDataY2] = useState(0);
    const [dataZ2, setBestDataZ2] = useState(0);

    const openModal = () => setSimulation(true);
    const closeModal = () => setSimulation(false);

    const handleOrientation = (event) => {
        console.log("ORIENTATION : ", event);
        const { alpha, beta, gamma } = event;
        setOrientationData({ alpha, beta, gamma });
    };

    const handleMotion = (event) => {
        console.log("MOTION: ", event);
        const { acceleration, rotationRate } = event;
        setMotionData({ acceleration, rotationRate });

        setBestDataX((prevX) => (acceleration.x > prevX ? acceleration.x : prevX).toFixed(2));
        setBestDataY((prevY) => (acceleration.y > prevY ? acceleration.y : prevY).toFixed(2));
        setBestDataZ((prevZ) => (acceleration.z > prevZ ? acceleration.z : prevZ).toFixed(2));

        setBestDataX2((prevX2) => (acceleration.x < prevX2 ? acceleration.x : prevX2).toFixed(2));
        setBestDataY2((prevY2) => (acceleration.y < prevY2 ? acceleration.y : prevY2).toFixed(2));
        setBestDataZ2((prevZ2) => (acceleration.z < prevZ2 ? acceleration.z : prevZ2).toFixed(2));
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
        <main className="h-screen w-screen bg-slate-700">
            <div className={`${simulationStart ? 'absolute h-screen w-screen z-20 bg-black opacity-50' : 'hidden'}`}></div>
            <div className={`${simulationStart ? "overflow-hidden" : ""} flex w-full h-full flex-col justify-around item-center`}>
                <div className="flex justify-center items-center h-full">
                    <Link to="/"><button className="bg-slate-400 h-20 p-8">Retourner à l'accueil</button></Link>
                    <button onClick={openModal} className="w-fit bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                        Démarrer la simulation
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center h-full">
                    <div className="flex gap-8 justify-auround py-4">
                        <p className="text-white">Point culminant Positif en X : {dataX}</p>
                        <p className="text-white">Point culminant Positif en Y : {dataY}</p>
                        <p className="text-white">Point culminant Positif en Z : {dataZ}</p>
                    </div>
                    <div className="flex gap-8 justify-auround py-4">
                        <p className="text-white">Point culminant Négatif en X : {dataX2}</p>
                        <p className="text-white">Point culminant Négatif en Y : {dataY2}</p>
                        <p className="text-white">Point culminant Négatif en Z : {dataZ2}</p>
                    </div>
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
                <div className="flex flex-col bg-red-300 h-fit">
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
            </div>
            {simulationStart && (
                <Modal onClose={closeModal}>
                    <h2 className="text-2xl font-bold mb-4">Contenu du Modal</h2>
                    <p className="text-gray-700">Ce texte peut être personnalisé selon vos besoins.</p>
                </Modal>
            )}
        </main>
    );
}

export default observer(Test);*/}