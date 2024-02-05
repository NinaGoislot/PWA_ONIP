import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../App.jsx';
import Modal from '../components/Modal.jsx';


function OneSimulation() {

    /********************************************************************* States ********************************************************************/
    const { id } = useParams();
    const { movementsStore } = useContext(GlobalContext);
    const movement = movementsStore.getMovementById(id);

    //Pour créer le timer avant de lancer la simulation
    const [isSimulationRunning, setSimulationRunning] = useState(false);
    const [countdown, setCountdown] = useState(3);

    //Pour créer le timer pendant la simulation
    const [isTimerRunning, setTimerRunning] = useState(false);
    const [timerMovement, setTimer] = useState(movement.timer || 0);

    //Pour créer la détection de mouvement
    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });

    const [direction, setDirection] = useState("None");
    const [sequenceIndex, setSequenceIndex] = useState(0);

    //Scores finaux
    const [score, setScore] = useState(0);
    const [nbMoves, setNbMoves] = useState(0);
    const [showResults, setShowResults] = useState(false);


    /******************************************************************** UseEffect ********************************************************************/

    //Pour gérer le chrono d'avant jeu
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

    //Pour gérer l'ajout des évènements
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

            if (!isTimerRunning && timerMovement != 0) {
                setTimerRunning(true);
            }

            return () => {
                console.log("L'écouteur d'évènement s'est arreté.'");
                window.removeEventListener('deviceorientation', handleOrientation);
                window.removeEventListener('devicemotion', handleMotion);
            };
        }
    }, [countdown, isSimulationRunning]);

    //Pour gérer le suivit des mouvements du tableau
    useEffect(() => {
        if (movement.direction.length > sequenceIndex && direction !== "None") {
            if (movement.direction[sequenceIndex] === direction) {
                console.log("Je set le score et l'index");
                setSequenceIndex(sequenceIndex + 1);
            }
        } else if (movement.direction.length == sequenceIndex && isTimerRunning) {
            setNbMoves(nbMoves + 1);
            setScore(score + movement.point_per_moves);
            setSequenceIndex(0);
        }
    }, [direction, sequenceIndex]);

    //Pour gérer le timer pendant la simulation
    useEffect(() => {
        let timerInterval;

        if (isTimerRunning && timerMovement > 0) {
            timerInterval = setInterval(() => {
                setTimer((prevTimerMovement) => prevTimerMovement - 1);
            }, 1000);
            console.log("Je dois diminuer le timer");
        }

        if (isTimerRunning && timerMovement == 0) {
            console.log("La simulation s'arrete et je dois montrer les résultats");
            stopSimulation();
            setShowResults(true);
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [isTimerRunning, timerMovement]);


    /******************************************************************** Fonctions ********************************************************************/
    const closeModal = () => setShowResults(false);
    const handleMotion = (event) => {
        const { alpha, beta, gamma } = event;
    setOrientationData({ alpha, beta, gamma });

    /**************** Logique des directions ****************/
    const threshold = movement.thershold_general;  // Seuil pour considérer un mouvement significatif
    let currentDirection = "None";  // Variable d'état pour suivre la direction actuelle

    if (Math.abs(beta) > threshold || Math.abs(gamma) > threshold) {
        console.log("Un mouvement est reconnu");

        const diagonalThreshold = 45;  // Seuil d'angle pour considérer le mouvement en diagonale

        if (Math.abs(beta) > diagonalThreshold && Math.abs(gamma) > diagonalThreshold) {
            // Mouvement en diagonale
            currentDirection = determineDiagonalDirection(beta, gamma);
        } else if (Math.abs(beta) > Math.abs(gamma)) {
            // Mouvement vertical
            currentDirection = beta > 0 ? "Sud" : "Nord";
        } else {
            // Mouvement horizontal
            currentDirection = gamma > 0 ? "Ouest" : "Est";
        }
    }

    /***************** Logique de jeu Timer *****************/
    if (currentDirection !== "None") {
        setDirection(currentDirection);
    }
};

const determineDiagonalDirection = (beta, gamma) => {
    // Insérez votre logique pour déterminer la direction en diagonale en fonction des angles beta et gamma
    // Vous pouvez utiliser des seuils appropriés pour chaque quadrant.
    // À titre d'exemple, je vais utiliser un seuil simple ici
    if (beta > 0 && gamma > 0) {
        return "Diagonale Nord-Est";
    } else if (beta < 0 && gamma > 0) {
        return "Diagonale Nord-Ouest";
    } else if (beta > 0 && gamma < 0) {
        return "Diagonale Sud-Est";
    } else if (beta < 0 && gamma < 0) {
        return "Diagonale Sud-Ouest";
    } else {
        return "None";  // Cas par défaut
    }
};


    const handleOrientation = (event) => {
        console.log("ORIENTATION : ", event);
        const { alpha, beta, gamma } = event;
        setOrientationData({ alpha, beta, gamma });
    };

    const findDirection = () => {

    };

    const findOrientation = () => {

    }

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

    /******************************************************************** Code HTML ********************************************************************/
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

            <h1 className='text-2xl font-bold text-blue-500 text-center'>Simulation du mouvement {movement.id}</h1>
            <p className='text-center italic text-sm text-white'>
                Évaluation portée sur {timerMovement != 0 ? 'le nombre de coups réalisés' : 'la précision du mouvement'}
            </p>

            {isSimulationRunning ? (
                // Afficher les éléments pendant la simulation (chrono, indication "Secouez !", etc.)
                <div className='flex flex-col gap-4'>
                    <p className="text-2xl text-center">{countdown > 0 ? countdown : timerMovement > 0 ? timerMovement : ''}</p>
                    <h2 className="text-2xl text-center text-red-500">{countdown > 0 ? "Prêt ?" : 'Secouez !'}</h2>
                    <h3 className="font-bold text-2xl w-full text-center text-white">Direction : {direction}</h3>
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
