import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../App.jsx';


function OneSimulation() {

    /********************************************************************* States ********************************************************************/
    const { id } = useParams();
    const { movementsStore } = useContext(GlobalContext);
    const movement = movementsStore.getMovementById(id);

    //Pour créer le timer
    const [isSimulationRunning, setSimulationRunning] = useState(false);
    const [timer, setTimer] = useState(movement.timer || 0);
    const [countdown, setCountdown] = useState(3);

    //Pour créer la détection de mouvement
    const [failuresCount, setFailuresCount] = useState(0);
    const [startTime, setStartTime] = useState(null);

    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
    const [direction, setDirection] = useState("Aucune direction n'a été trouvée");
    const [sequenceIndex, setSequenceIndex] = useState(0);

    //Scores finaux
    const [score, setScore] = useState(0);
    const [nbMoves, setNbMoves] = useState(0);


    /******************************************************************** UseEffect ********************************************************************/

    //Pour gérer la mise à jour du timer
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

    //Pour gérer la mise à jour du timer
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

    /******************************************************************** Fonctions ********************************************************************/

    const handleMotion = (event) => {
        console.log("MOTION: ", event);

        const { acceleration, rotationRate } = event;
        setMotionData({ acceleration, rotationRate });

        /**************** Logique des directions ****************/
        const threshold = movement.thershold_general;  // Seuil pour considérer un mouvement significatif
        let currentDirection = "Aucun mouvement significatif";  // Variable d'état pour suivre la direction actuelle

        if (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold) {
            if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                // Mouvement horizontal
                currentDirection = acceleration.x > threshold ? "Ouest" : "Est";
            } else {
                // Mouvement vertical
                currentDirection = acceleration.y > threshold ? "Sud" : "Nord";
            }
        }

        /***************** Logique de jeu Timer *****************/
        if (!(movement.direction.length > currentDirection)) {
            if (movement.direction[sequenceIndex] == currentDirection) {
                setScore((prevScore) => prevScore + movement.point_per_moves);
            }
        }

        // Mettez à jour la direction seulement si un mouvement significatif a été détecté
        if (currentDirection !== "Aucun mouvement significatif") {
            setDirection(currentDirection);
        }

    };

    const startSimulation = () => {
        setSimulationRunning(true);
        setScore(0);
        setNbMoves(0);
        setSequenceIndex(0);

        // Logique pour démarrer le chrono, si nécessaire
        // ...

        // Exemple de délai de 3 secondes avant de lancer la simulation
        /*setTimeout(() => {
            setTimer(movement.timer || 0);
            // Logique pour lancer la simulation (par exemple, afficher "Secouez !")
        }, 3000);*/
    };

    const stopSimulation = () => {
        setSimulationRunning(false);

        // Logique pour arrêter la simulation (par exemple, afficher "Stop !")
        // ...

    };

    /******************************************************************** Code HTML ********************************************************************/
    return (
        <main className="w-screen h-screen flex flex-col gap-4 bg-slate-700 p-4">
            <h1 className='text-2xl font-bold ext-white text-center'>Simulation du mouvement {movement.id}</h1>
            <p className='text-center italic text-sm text-white'>
                Évaluation portée sur {movement.timer ? 'le nombre de coups réalisés' : 'la précision du mouvement'}
            </p>

            {isSimulationRunning ? (
                // Afficher les éléments pendant la simulation (chrono, indication "Secouez !", etc.)
                <div className='flex flex-col gap-4'>
                    <p className="text-2xl text-center">{countdown > 0 ? countdown : ''}</p>
                    <h2 className="text-2xl text-center text-red-500">{countdown > 0 ? "Prêt ?" : 'Secouez !'}</h2>
                    <h3 className="font-bold text-2xl w-full text-center text-white">Direction : {direction}</h3>
                    <div className="flex flex-col bg-red-300 h-fit">
                        {motionData && (
                            <div className='flex flex-col gap-2'>
                                <p>Acceleration X: {motionData.acceleration.x}</p>
                                <p>Acceleration Y: {motionData.acceleration.y}</p>
                                <p>Acceleration Z: {motionData.acceleration.z}</p>
                                <p>Rotation Rate Alpha: {motionData.rotationRate.alpha}</p>
                                <p>Rotation Rate Beta: {motionData.rotationRate.beta}</p>
                                <p>Rotation Rate Gamma: {motionData.rotationRate.gamma}</p>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col gap-4'>
                        <p className='text-white'>Score : {score}</p>
                        <p className='text-white'>Index : {sequenceIndex}</p>
                    </div>

                    {/* Ajoutez ici des éléments liés à la simulation en cours */}
                </div>
            ) : (
                // Afficher les éléments avant le démarrage de la simulation
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
    )
}
export default OneSimulation;