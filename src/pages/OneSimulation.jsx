import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../App.jsx';

function OneSimulation() {
    const { id } = useParams();
    const { movementsStore } = useContext(GlobalContext);
    const movement = movementsStore.getMovementById(id);

    const [isSimulationRunning, setSimulationRunning] = useState(false);
    const [timer, setTimer] = useState(movement.timer || 0);
    const [countdown, setCountdown] = useState(3);

    const [failuresCount, setFailuresCount] = useState(0);
    const [startTime, setStartTime] = useState(null);

    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 } });
    const [direction, setDirection] = useState("None");
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [nbMoves, setNbMoves] = useState(0);

    const [expectedSequence, setExpectedSequence] = useState(movement.direction || []);

    useEffect(() => {
        let countdownInterval;

        if (isSimulationRunning && countdown > 0) {
            countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }

        return () => {
            clearInterval(countdownInterval);
        };
    }, [isSimulationRunning, countdown]);

    useEffect(() => {
        if (countdown === 0) {
            const setupMotionListener = () => {
                if (window.DeviceMotionEvent) {
                    window.addEventListener('devicemotion', handleMotion);
                } else {
                    console.error("DeviceMotion n'est pas supporté");
                }
            };

            setupMotionListener();

            return () => {
                console.log("Le return est passé");
                window.removeEventListener('devicemotion', handleMotion);
            };
        }
    }, [countdown]);

    const checkDirectionMatch = () => {
        const currentExpectedDirection = expectedSequence[sequenceIndex];
        return direction === currentExpectedDirection;
    };

    const handleMotion = (event) => {
        const { acceleration } = event;
        setMotionData({ acceleration });

        const threshold = movement.threshold_general;
        let currentDirection = "Aucune";

        if (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold) {
            if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                currentDirection = acceleration.x > 0 ? "Ouest" : "Est";
            } else {
                currentDirection = acceleration.y > 0 ? "Sud" : "Nord";
            }
        }

        setDirection(currentDirection);

        if (isSimulationRunning && checkDirectionMatch()) {
            setScore((prevScore) => prevScore + 1);
            setSequenceIndex((prevIndex) => prevIndex + 1);

            if (sequenceIndex === expectedSequence.length - 1) {
                setExpectedSequence(movement.direction || []);
                setSequenceIndex(0);
            }
        }
    };

    const startSimulation = () => {
        setSimulationRunning(true);
        setScore(0);
        setNbMoves(0);
        setSequenceIndex(0);
        setExpectedSequence(movement.direction || []);
    };

    const stopSimulation = () => {
        setSimulationRunning(false);
    };

    return (
        <main className="w-screen h-screen flex flex-col gap-4 bg-slate-700 p-4 justify-center items-center">
            <h1 className='text-2xl font-bold text-pink-500 text-center'>Simulation du mouvement {movement.id}</h1>
            <p className='text-center italic text-sm text-white'>
                Évaluation portée sur {movement.timer ? 'le nombre de coups réalisés' : 'la précision du mouvement'}
            </p>

            {isSimulationRunning ? (
                <div className='flex flex-col gap-4'>
                    <p className="text-2xl text-center">{countdown > 0 ? countdown : ''}</p>
                    <h2 className="text-2xl text-center text-red-500">{countdown > 0 ? "Prêt ?" : 'Secouez !'}</h2>
                    <h3 className="font-bold text-2xl w-full text-center text-white">Direction : {direction}</h3>
                    <div className='flex flex-col gap-4'>
                        <p className='text-white'>Score : {score}</p>
                        <p className='text-white'>Index : {sequenceIndex}</p>
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
