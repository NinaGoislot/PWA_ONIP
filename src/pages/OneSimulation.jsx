
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../App.jsx';
import Modal from '../components/Modal.jsx';

function OneSimulation() {
    const { id } = useParams();
    const { movementsStore } = useContext(GlobalContext);
    const movement = movementsStore.getMovementById(id);

    const [isSimulationRunning, setSimulationRunning] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [isTimerRunning, setTimerRunning] = useState(false);
    const [timerMovement, setTimer] = useState(movement.timer || 0);
    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [direction, setDirection] = useState("None");
    const [orientation, setOrientation] = useState("None");
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [nbMoves, setNbMoves] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const motionDataRef = useRef({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
    const orientationDataRef = useRef({ alpha: 0, beta: 0, gamma: 0 });

    const closeModal = () => setShowResults(false);

    const handleMotion = (event) => {
        const { acceleration, rotationRate } = event;
        motionDataRef.current = { acceleration, rotationRate };
        setMotionData({ acceleration, rotationRate });
    };

    const handleOrientation = (event) => {
        const { alpha, beta, gamma } = event;
        orientationDataRef.current = { alpha, beta, gamma };

        switch (true) {
            case (alpha > 0 && alpha <= 37.75) || (alpha > 322.25):
                setOrientation("N");
                break;
            case alpha > 307.75 && alpha <= 322.25:
                setOrientation("NE");
                break;
            case alpha > 247.5 && alpha <= 307.75:
                setOrientation("E");
                break;
            case alpha > 217.75 && alpha <= 247.5:
                setOrientation("SE");
                break;
            case alpha > 142.25 && alpha <= 217.75:
                setOrientation("S");
                break;
            case alpha > 127.75 && alpha <= 142.25:
                setOrientation("SO");
                break;
            case alpha > 52.25 && alpha <= 127.75:
                setOrientation("O");
                break;
            case alpha > 37.75 && alpha <= 52.25:
                setOrientation("NO");
                break;
            default:
                setOrientation("None");
                break;
        }
    };

    useEffect(() => {
        if (countdown === 0 && isSimulationRunning) {
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
                    console.error("DeviceMotion n'est pas supporté sur cet appareil.");
                }
            };

            setupOrientationListener();
            setupMotionListener();

            if (
                DeviceMotionEvent &&
                typeof DeviceMotionEvent.requestPermission === "function"
            ) {
                DeviceMotionEvent.requestPermission();
            }

            if (!isTimerRunning && timerMovement != 0) {
                setTimerRunning(true);
            }

            return () => {
                window.removeEventListener('deviceorientation', handleOrientation);
                window.removeEventListener('devicemotion', handleMotion);
            };
        }
    }, [countdown, isSimulationRunning]);

    useEffect(() => {
        if (movement.direction.length > sequenceIndex && direction !== "None") {
            if (movement.direction[sequenceIndex] === direction) {
                setSequenceIndex(sequenceIndex + 1);
            }
        } else if (movement.direction.length == sequenceIndex && isTimerRunning) {
            setNbMoves(nbMoves + 1);
            setScore(score + movement.point_per_moves);
            setSequenceIndex(0);
        }
    }, [direction, sequenceIndex]);

    useEffect(() => {
        let timerInterval;

        if (isTimerRunning && timerMovement > 0) {
            timerInterval = setInterval(() => {
                setTimer((prevTimerMovement) => prevTimerMovement - 1);
            }, 1000);
        }

        if (isTimerRunning && timerMovement == 0) {
            stopSimulation();
            setShowResults(true);
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [isTimerRunning, timerMovement]);

    useEffect(() => {
        const threshold = movement.threshold_general;
        let currentDirection = "None";

        const { acceleration } = motionDataRef.current;

        if (Math.abs(acceleration.x) > threshold && Math.abs(acceleration.y) > threshold) {
            switch (orientation) {
                case "N":
                    console.log("Je rentre dans le switch");
        
                    if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                        currentDirection = acceleration.x > 0 ? "Ouest" : "Est";
                    } else {
                        currentDirection = acceleration.y > 0 ? "Sud" : "Nord";
                    }
                    if (Math.abs(acceleration.x) > threshold && Math.abs(acceleration.y) > threshold) {
                        if (acceleration.x > 0) {
                            currentDirection = acceleration.y > 0 ? "Nord-Est" : "Sud-Est";
                        } else {
                            currentDirection = acceleration.y > 0 ? "Nord-Ouest" : "Sud-Ouest";
                        }
                    }
                    break;
                case "NE":
                    if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                        currentDirection = acceleration.x > 0 ? "Nord-Ouest" : "Sud-Est";
                        0
                    } else {
                        currentDirection = acceleration.y > 0 ? "Sud-Ouest" : "Nord-Est";
                    }
                    if (Math.abs(acceleration.x) > threshold && Math.abs(acceleration.y) > threshold) {
                        if (acceleration.x > 0) {
                            currentDirection = acceleration.y > 0 ? "Nord" : "Est";
                        } else {
                            currentDirection = acceleration.y > 0 ? "Ouest" : "Sud";
                        }
                    }
                    break;
                case "E":
                    if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                        currentDirection = acceleration.x > 0 ? "Nord" : "Sud";
                    } else {
                        currentDirection = acceleration.y > 0 ? "Ouest" : "Est";
                    }
                    if (Math.abs(acceleration.x) > threshold && Math.abs(acceleration.y) > threshold) {
                        if (acceleration.x > 0) {
                            currentDirection = acceleration.y > 0 ? "Sud-Est" : "Sud-Ouest";
                        } else {
                            currentDirection = acceleration.y > 0 ? "Nord-Est" : "Nord-Ouest";
                        }
                    }
                    break;
                case "SE":
                    if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                        currentDirection = acceleration.x > 0 ? "Nord-Est" : "Sud-Ouest";
                    } else {
                        currentDirection = acceleration.y > 0 ? "Nord-Ouest" : "Sud-Est";
                    }
                    if (Math.abs(acceleration.x) > threshold && Math.abs(acceleration.y) > threshold) {
                        if (acceleration.x > 0) {
                            currentDirection = acceleration.y > 0 ? "Sud" : "Ouest";
                        } else {
                            currentDirection = acceleration.y > 0 ? "Est" : "Nord";
                        }
                    }
                    break;
                case "S":
                    if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                        currentDirection = acceleration.x > 0 ? "Est" : "Ouest";
                    } else {
                        currentDirection = acceleration.y > 0 ? "Nord" : "Sud";
                    }
                    if (Math.abs(acceleration.x) > threshold && Math.abs(acceleration.y) > threshold) {
                        if (acceleration.x > 0) {
                            currentDirection = acceleration.y > 0 ? "Sud-Ouest" : "Nord-Ouest";
                        } else {
                            currentDirection = acceleration.y > 0 ? "Sud-Est" : "Nord-Est";
                        }
                    }
                    break;
                case "SO":
                    if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                        currentDirection = acceleration.x > 0 ? "Sud-Est" : "Nord-Ouest";
                    } else {
                        currentDirection = acceleration.y > 0 ? "Nord-Est" : "Sud-Ouest";
                    }
                    if (Math.abs(acceleration.x) > threshold && Math.abs(acceleration.y) > threshold) {
                        if (acceleration.x > 0) {
                            currentDirection = acceleration.y > 0 ? "Ouest" : "Nord";
                        } else {
                            currentDirection = acceleration.y > 0 ? "Sud" : "Est";
                        }
                    }
                    break;
                case "O":
                    if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                        currentDirection = acceleration.x > 0 ? "Sud" : "Nord";
                    } else {
                        currentDirection = acceleration.y > 0 ? "Est" : "Ouest";
                    }
                    if (Math.abs(acceleration.x) > threshold && Math.abs(acceleration.y) > threshold) {
                        if (acceleration.x > 0) {
                            currentDirection = acceleration.y > 0 ? "Nord-Ouest" : "Nord-Est";
                        } else {
                            currentDirection = acceleration.y > 0 ? "Sud-Ouest" : "Sud-Est";
                        }
                    }
                    break;
                case "NO":
                    if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                        currentDirection = acceleration.x > 0 ? "Sud-Ouest" : "Nord-Est";
                    } else {
                        currentDirection = acceleration.y > 0 ? "Sud-Est" : "Nord-Ouest";
                    }
                    if (Math.abs(acceleration.x) > threshold && Math.abs(acceleration.y) > threshold) {
                        if (acceleration.x > 0) {
                            currentDirection = acceleration.y > 0 ? "Nord" : "Est";
                        } else {
                            currentDirection = acceleration.y > 0 ? "Ouest" : "Sud";
                        }
                    }
                    break;
                default:
                    console.log("Aucune donnée reconnue")
                    break;
            }
        }

        if (currentDirection !== "None") {
            setDirection(currentDirection);
        }
    }, [motionData, orientation]);

    const startSimulation = () => {
        setSimulationRunning(true);
        setScore(0);
        setNbMoves(0);
        setSequenceIndex(0);
    };

    const stopSimulation = () => {
        setSimulationRunning(false);
        setTimerRunning(false);
        setCountdown(3);
        setTimer(movement.timer || 0);
    };

    return (
        <main className="w-screen h-screen flex flex-col gap-4 bg-slate-700 p-4 justify-center items-center">
            {showResults && (
                <Modal onClose={closeModal}>
                    <h2 className="text-xl font-bold mb-4 text-red-500">Résultats</h2>
                    <div className="flex flex-col gap-8">
                        <p className="text-lg font-bold">Nombre de coups : {nbMoves}</p>
                        <p className="text-lg font-bold">Points : {score}</p>
                    </div>
                </Modal>
            )}

            <div className={`${showResults ? 'absolute h-screen w-screen bg-black opacity-50' : 'hidden'}`}></div>

            <h1 className='text-2xl font-bold text-green-500 text-center'>Simulation du mouvement {movement.id}</h1>
            <p className='text-center italic text-sm text-white'>
                Évaluation portée sur {timerMovement != 0 ? 'le nombre de coups réalisés' : 'la précision du mouvement'}
            </p>

            {isSimulationRunning ? (
                <div className='flex flex-col gap-4'>
                    <p className="text-2xl text-center">{countdown > 0 ? countdown : timerMovement > 0 ? timerMovement : ''}</p>
                    <h2 className="text-2xl text-center text-red-500">{countdown > 0 ? "Prêt ?" : 'Secouez !'}</h2>
                    <h3 className="font-bold text-2xl w-full text-center text-white">Direction : {direction}</h3>
                    <h3 className="font-bold text-2xl w-full text-center text-white">Orientation: {orientation}</h3>
                    <div className='flex flex-col gap-4'>
                        <p className='text-white'>Score : {score}</p>
                        <p className='text-white'>Index : {sequenceIndex}</p>
                        <p className='text-white'>alpha : {Math.round(orientationData.alpha * 100) / 100}</p>
                        <p className='text-white'>beta : {Math.round(orientationData.beta * 100) / 100}</p>
                        <p className='text-white'>gamma : {Math.round(orientationData.gamma * 100) / 100}</p>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <button className='bg-red-500 text-white text-center p-2 w-fit' onClick={startSimulation}>Start</button>
                </div>
            )}

            {isSimulationRunning ? (
                <div className="w-full flex items-center justify-center text-center">
                    <button className={`bg-red-500 text-white text-center p-2 w-fit ${countdown > 0 ? "hidden ?" : 'block'}`} onClick={stopSimulation}>Arrêter la simulation</button>
                </div>
            ) : ""}
        </main>
    );
}

export default OneSimulation;
