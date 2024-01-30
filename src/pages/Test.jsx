import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Modal from '../components/Modal';

function Test() {
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
    const [simulationStart, setSimulation] = useState(false);
    const [nbMovements, setNbMovements] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTimerActive, setTimer] = useState(false);
    const [isTestOver, setTestOver] = useState(false);

    const [dataX, setBestDataX] = useState(0);
    const [dataY, setBestDataY] = useState(0);
    const [dataZ, setBestDataZ] = useState(0);

    const [dataX2, setBestDataX2] = useState(0);
    const [dataY2, setBestDataY2] = useState(0);
    const [dataZ2, setBestDataZ2] = useState(0);

    const [highX, setHigherX] = useState(0);
    const [highY, setHigherY] = useState(0);
    const [highZ, setHigherZ] = useState(0);

    const [lowX, setLowerX] = useState(0);
    const [lowY, setLowerY] = useState(0);
    const [lowZ, setLowerZ] = useState(0);

    const openModal = () => {
        setDisplayText('Secoue !');
        setTimer(true);
        setTestOver(false);
        setSimulation(true);

        setTimeout(() => {
            setTimer(false);
            setDisplayText('Stop !');
            setTestOver(true);

        }, 3000);
    };
    const closeModal = () => setSimulation(false);


    /*const handleOrientation = (event) => {
        console.log(event);
        const alpha = event.alpha;  // rotation autour de l'axe Z
        const beta = event.beta;    // rotation autour de l'axe X
        const gamma = event.gamma;  // rotation autour de l'axe Y

        setOrientationData({ alpha, beta, gamma });
    };*/

    const handleOrientation = (event) => {
        console.log("ORIENTATION : ", event);
        const { alpha, beta, gamma } = event;
        setOrientationData({ alpha, beta, gamma });
    };

    const handleMotion = (event) => {
        console.log("MOTION: ", event);

        const previousX = motionData.acceleration.x;

        const { acceleration, rotationRate } = event;
        setMotionData({ acceleration, rotationRate });

        const newX = motionData.acceleration.x;

        if (isTimerActive) {
            setHigherX(dataX);
            setHigherY(dataY);
            setHigherZ(dataZ);

            setLowerX(dataX2);
            setLowerY(dataY2);
            setLowerZ(dataZ2);
        }

        if (previousX > 0) {
            if (newX < 0) {
                setNbMovements((prevNbMovements) => prevNbMovements + 1);
            }
        } else if (previousX < 0) {
            if (newX > 0) {
                setNbMovements((prevNbMovements) => prevNbMovements + 1);
            }
        }

        /*setBestDataX((prevX) => formatAndCompare(acceleration.x, prevX, "up"));
        setBestDataY((prevY) => formatAndCompare(acceleration.y, prevY, "up"));
        setBestDataZ((prevZ) => formatAndCompare(acceleration.z, prevZ, "up"));

        setBestDataX2((prevX2) => formatAndCompare(acceleration.x, prevX2, "down"));
        setBestDataY2((prevY2) => formatAndCompare(acceleration.y, prevY2, "down"));
        setBestDataZ2((prevZ2) => formatAndCompare(acceleration.z, prevZ2, "down"));*/

        setBestDataX((prevX) => Math.round(acceleration.x * 100) / 100 > prevX ? Math.round(acceleration.x * 100) / 100 : prevX);
        setBestDataY((prevY) => Math.round(acceleration.y * 100) / 100 > prevY ? Math.round(acceleration.y * 100) / 100 : prevY);
        setBestDataZ((prevZ) => Math.round(acceleration.z * 100) / 100 > prevZ ? Math.round(acceleration.z * 100) / 100 : prevZ);
        
        setBestDataX2((prevX2) => Math.round(acceleration.x * 100) / 100 < prevX2 ? Math.round(acceleration.x * 100) / 100 : prevX2);
        setBestDataY2((prevY2) => Math.round(acceleration.y * 100) / 100 < prevY2 ? Math.round(acceleration.y * 100) / 100 : prevY2);
        setBestDataZ2((prevZ2) => Math.round(acceleration.z * 100) / 100 < prevZ2 ? Math.round(acceleration.z * 100) / 100 : prevZ2);
        
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

    const formatAndCompare = (value, prevValue, signe) => {
        var formattedValue;
        if (signe == "up") {
            formattedValue = value > prevValue ? value : prevValue;
        }
        if (signe == "down") {
            formattedValue = value < prevValue ? value : prevValue;
        }
        formattedValue = formattedValue !== undefined ? formattedValue.toFixed(2) : formattedValue;
        return formattedValue;
    };

    return (
        <main className="h-screen w-screen bg-slate-700">
            {simulationStart && (
                <Modal onClose={closeModal}>
                    <h2 className="text-xl font-bold mb-4">{displayText}</h2>
                    <p>Test : {orientationData.alpha}</p>
                    {isTestOver && (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold">Plus hauts scores</h3>
                                <p>Plus haute accélération X : {highX}</p>
                                <p>Plus haute accélération Y : {highY}</p>
                                <p>Plus haute accélération Z : {highZ}</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold">Plus bas scores</h3>
                                <p>Plus basse accélération X : {lowX}</p>
                                <p>Plus basse accélération Y : {lowY}</p>
                                <p>Plus basse accélération Z : {lowZ}</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold">Nombre de coups : {nbMovements / 2}</h3>
                            </div>
                        </div>
                    )}
                </Modal>
            )}
            <div className={`${simulationStart ? 'absolute h-screen w-screen bg-black opacity-50' : 'hidden'}`}></div>
            <div className={`${simulationStart ? "overflow-hidden" : ""} flex w-full h-full flex-col justify-around item-center`}>
                <div className="flex gap-4 justify-center items-center h-full">
                    <Link to="/"><button className="w-fit bg-slate-500 text-white font-bold py-2 px-4 rounded hover:bg-slate-600">Retourner à l'accueil</button></Link>
                    <button onClick={openModal} className="w-fit bg-slate-500 text-white font-bold py-2 px-4 rounded hover:bg-slate-600">
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
    const [nbMovements, setNbMovements] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTimerActive, setTimer] = useState(false);
    const [isTestOver, setTestOver] = useState(false);

    const [dataX, setBestDataX] = useState(0);
    const [dataY, setBestDataY] = useState(0);
    const [dataZ, setBestDataZ] = useState(0);

    const [dataX2, setBestDataX2] = useState(0);
    const [dataY2, setBestDataY2] = useState(0);
    const [dataZ2, setBestDataZ2] = useState(0);

   const openModal = () => {
        setDisplayText('Secoue !');
        setTimer(true);
        setTestOver(false);
        setSimulation(true);

        // Démarrez le chronomètre au clic
        setTimeout(() => {
            setTimer(false);
            setDisplayText('Stop !');
            setTestOver(true);
        }, 5000);
    };
    const closeModal = () => setSimulation(false);

    const handleOrientation = (event) => {
        if (isTimerActive) {
            console.log("ORIENTATION : ", event);
            const { alpha, beta, gamma } = event;
            setOrientationData({ alpha, beta, gamma });
        }
    };

    const handleMotion = (event) => {
        if (isTimerActive) {
            console.log("MOTION: ", event);

            const previousX = motionData.acceleration.x;

            const { acceleration, rotationRate } = event;
            setMotionData({ acceleration, rotationRate });

            const newX = motionData.acceleration.x;

            if (previousX > 0) {
                if (newX < 0) {
                    setNbMovements((prevNbMovements) => prevNbMovements + 1);
                }
            } else if (previousX < 0) {
                if (newX > 0) {
                    setNbMovements((prevNbMovements) => prevNbMovements + 1);
                }
            }

            setBestDataX((prevX) => formatAndCompare(acceleration.x, prevX));
            setBestDataY((prevY) => formatAndCompare(acceleration.y, prevY));
            setBestDataZ((prevZ) => formatAndCompare(acceleration.z, prevZ));

            setBestDataX2((prevX2) => formatAndCompare(acceleration.x, prevX2));
            setBestDataY2((prevY2) => formatAndCompare(acceleration.y, prevY2));
            setBestDataZ2((prevZ2) => formatAndCompare(acceleration.z, prevZ2));
        }
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
        <main className="h-screen w-screen bg-slate-700">
            {simulationStart && (
                <Modal onClose={closeModal}>
                    <h2 className="text-xl font-bold mb-4">{displayText}</h2>
                    <p>Test : {orientationData.alpha}</p>
                    {isTestOver && (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold">Plus hauts scores</h3>
                                <p>Plus haute accélération X : {dataX}</p>
                                <p>Plus haute accélération Y : {dataY}</p>
                                <p>Plus haute accélération Z : {dataZ}</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold">Plus bas scores</h3>
                                <p>Plus basse accélération X : {dataX2}</p>
                                <p>Plus basse accélération Y : {dataY2}</p>
                                <p>Plus basse accélération Z : {dataZ2}</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold">Nombre de coups : {nbMovements / 2}</h3>
                            </div>
                        </div>
                    )}
                </Modal>
            )}
            <div className={`${simulationStart ? 'absolute h-screen w-screen bg-black opacity-50' : 'hidden'}`}></div>
            <div className={`${simulationStart ? "overflow-hidden" : ""} flex w-full h-full flex-col justify-around item-center`}>
                <div className="flex gap-4 justify-center items-center h-full">
                    <Link to="/"><button className="w-fit bg-slate-500 text-white font-bold py-2 px-4 rounded hover:bg-slate-600">Retourner à l'accueil</button></Link>
                    <button onClick={openModal} className="w-fit bg-slate-500 text-white font-bold py-2 px-4 rounded hover:bg-slate-600">
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
        </main>
    );
}

export default observer(Test);*/}