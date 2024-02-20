import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../App.jsx';
import { Link } from 'react-router-dom';
//import ml5 from 'https://unpkg.com/ml5@latest/dist/ml5.min.js';
import { socket } from "../socket";

function Game() {

    const { movementsStore } = useContext(GlobalContext);

    //Infos du serveur
    const [movementRequired, setMovementRequiered] = useState("");
    const [roomId, setRoomId] = useState("");
    const [numeroPlayer, setNumeroPlayer] = useState("");
    const [alreadyHasMovement, setHasMovement] = useState(false);

    //Chrono
    const [countdown, setCountdown] = useState(3);
    const [isChronoStarted, setChronoStarted] = useState(false);

    //Suivre la reconnaissance de mouvements  
    const [timer, setTimer] = useState("");
    const [isMovementRunning, setMovementRunning] = useState(false);
    const [movementRecognized, setMovementRecognized] = useState("");

    //Données des mouvements
    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [finalData, setFinalData] = useState([]);

    /*const inferenceActive = ref(false);
    const scaleFactor = ref(10);
    const motionData = ref([]);
    const fixedRecordingLength = ref(30);
    const saveFilename = ref("myGestures");
    const className = ref("");
    const currentdetectedClass = ref("");
    const currentdetectedClassConfidence = ref(0);
    const gesturePauseMaxDelay = ref(1000);

    const gestureDelay = ref(null);
    const orientationRunning = ref(false);
    const recordingOrientation = ref(false);
    const lastAcceleration = ref(null);
    const lastRotationRate = ref(null);

    const touchzone = ref(null);
    const useOrientation = ref(true);
    const useAccel = ref(true);
    const useRotRate = ref(true);

    const currentSessionData = reactive({ countByLabel: null, numLabels: 0 });

    const currentLabelExamplesCount = computed(() => {
        let count = className.value != "" ? currentSessionData.countByLabel[className.value] || 0 : 0;
        return count;
    });*/

    /********************************************* USE EFFECT *********************************************/

    //Pour gérer l'ajout des évènements
    useEffect(() => {
        if (isMovementRunning) {
            console.log("L'écouteur d'évènements commence.'");

            const setupOrientationListener = () => {
                if (window.DeviceOrientationEvent) {
                    window.addEventListener('deviceorientation', handleOrientation);
                } else {
                    console.error("DeviceOrientation n'est pas supporté sur cet appareil.");
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

            // Request permission for iOS 13+ devices
            if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
                DeviceMotionEvent.requestPermission();
            }

            return () => {
                console.log("L'écouteur d'évènements s'est arreté.'");
                window.removeEventListener('deviceorientation', handleOrientation);
                window.removeEventListener('devicemotion', handleMotion);
            };
        } else if (finalData.length > 1) { //Si j'ai récupéré des données avec orientationData
            console.log("Je rentre dans le else conditionnel'");
            let score;
            let tabDataDone = normalizeData(finalData);
            tabDataDone = subSampleData(tabDataDone);
            tabDataDone = flattenData(tabDataDone);

            const predictedMovement = classifyData(tabDataDone);
            console.log("Étape 4 ► Le mouvement reconnu est : ", predictedMovement);

            setMovementRecognized(predictedMovement);
            if (predictedMovement == movementRequired.id){
                score = movementRequired.point_per_moves;
                console.log("Points gagnés : " + score);
            }
            setFinalData("");
            setHasMovement(false);
            socket.emit("MOVEMENT_DONE", score, roomId, numeroPlayer);
        }
    }, [isMovementRunning]);

    //Stocker les données de direction et motion dans un tableau
    useEffect(() => {
        setFinalData(prevData => [...prevData, { x: orientationData.beta, y: orientationData.gamma, z: orientationData.alpha, accX: motionData.acceleration.x, accY: motionData.acceleration.y, accZ: motionData.acceleration.z, rotRateX: motionData.rotationRate.beta, rotRateY: motionData.rotationRate.gamma, rotRateZ: motionData.rotationRate.alpha }]);
    }, [motionData, orientationData]);

    //Pour gérer le chrono d'avant jeu
    useEffect(() => {
        let countdownInterval;
        if (isChronoStarted && countdown > 0) {
            console.log("useEffect ► Je diminue le countdown");

            countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0 ) {
            setChronoStarted(false);
            if (movementRequired.timer) {
                setTimer(movementRequired.timer);
                setMovementRunning(true);
            }
        }

        return () => {
            clearInterval(countdownInterval);
        };
    }, [isChronoStarted, countdown]);

    //Pour gérer le timer pendant la simulation
    useEffect(() => {
        let timerInterval;

        if(isMovementRunning && timer){
            if (timer > 0) {
                timerInterval = setInterval(() => {
                    setTimer((prevTimerMovement) => prevTimerMovement - 1);
                }, 1000);
            }
            if (timer == 0) {
                console.log("Le timer est fini");
                stopMotion();
            }
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [isMovementRunning, timer]);

    /***************************************** Évènements ******************************************/
    const handleMotion = (event) => {
        const { acceleration, rotationRate } = event;
        const seuil = movementRequired.thershold;
        
        if(acceleration.x > seuil || acceleration.y > seuil || acceleration.z > seuil) {
            setMotionData({ acceleration, rotationRate });
        } else if (finalData.length > 1) {
            stopMotion();
        }
    };

    const handleOrientation = (event) => {
        const { alpha, beta, gamma } = event;
        const seuil = movementRequired.thershold;

        if(orientationData.beta > seuil || orientationData.gamma > seuil || orientationData.alpha > seuil) {
            setOrientationData({ alpha, beta, gamma });
        } else if (seuil > 0 && finalData.length > 1) {
            stopMotion();
        }
    };


    /****************************************** FONCTIONS ******************************************/
    const startMotion = () => {
        console.log("startMotion ► Je démarre tout le processus")
        setChronoStarted(true);
    };

    const stopMotion = () => {
        console.log("startMotion ► J'arrête le processus.")

        setCountdown(3);
        setMovementRunning(false);
    };

    /********************************************* ML5 *********************************************/
    // 1. Normalisation des données entre 0 et 1
    function normalizeData(data) {
        const normalizedData = [];
        const keys = Object.keys(data[0]);

        // Calculer les valeurs maximales et minimales pour chaque dimension
        const maxValues = {};
        const minValues = {};
        keys.forEach((key) => {
            maxValues[key] = Math.max(...data.map((entry) => entry[key]));
            minValues[key] = Math.min(...data.map((entry) => entry[key]));
        });

        // Normaliser chaque entrée de données
        data.forEach((entry) => {
            const normalizedEntry = {};
            keys.forEach((key) => {
                // Normaliser la valeur pour la dimension actuelle
                normalizedEntry[key] = (entry[key] - minValues[key]) / (maxValues[key] - minValues[key]);
            });
            normalizedData.push(normalizedEntry);
        });

        return normalizedData;
    }

    // 2. Sous-échantillonnage des données
    function subSampleData(data, rate = 30) {
        if (data.length <= rate) {
            return data;
        }

        const subSampledData = [];
        const subSampleRate = Math.floor(data.length / rate); // Calcul du taux de sous-échantillonnage

        for (let i = 0; i < data.length; i += subSampleRate) {
            subSampledData.push(data[i]); // Ajout de chaque échantillon à intervalle régulier
            if (subSampledData.length === rate - 1) {
                // Ensure the last data point is always included
                subSampledData.push(data[data.length - 1]);
                break;
            }
        }

        return subSampledData;
    }

    // 3. Aplatir les données
    function flattenData(data) {
        const flattenedData = [];

        data.forEach((entry) => {
            Object.values(entry).forEach((value) => {
                flattenedData.push(value);
            });
        });

        return flattenedData;
    }

    // 4. Classification des données avec KNN
    function classifyData(data) {
        console.log("Je rentre dans la fonction classifyData ");

        const knnClassifier = ml5.KNNClassifier();
        knnClassifier.load('../myGestures-30.json', () => {
            console.log('Données d\'entraînement chargées avec succès.');

            // Classer les données avec le modèle KNN
            knnClassifier.classify(data, (error, result) => {
                if (error) {
                    console.error(error);
                    return;
                }
                console.log("Résultat du classify : ", result)
                const resultsData = getLabel(result);
                // Récupérer le mouvement prédit
                const recognizedMovement = resultsData.label;

                // Récupérer l'intervalle de confiance du mouvement prédit
                const confidenceInterval = Math.round(resultsData.confidence * 100) / 100; //arrondir
                // Afficher le résultat
                console.log('Mouvement prédit :', recognizedMovement);
                console.log('Intervalle de confiance :', confidenceInterval);

                return recognizedMovement;
            });
        });
    }

    function getLabel(result) {
        const entries = Object.entries(result.confidencesByLabel);
        let greatestConfidence = entries[0];
        for (let i = 0; i < entries.length; i++) {
            if (entries[i][1] > greatestConfidence[1]) {
                greatestConfidence = entries[i];
            }
        }

        //  console.log(greatestConfidence);
        return { label: greatestConfidence[0], confidence: greatestConfidence[1] };
    }

    /********************************************* SOCKET *********************************************/

    socket.on("START_MOVEMENT", (movement, roomId, numeroPlayer) => {
        console.log("START_MOVEMENT ► Je reçois l'info du socket");

        if (!alreadyHasMovement) {
            console.log("START_MOVEMENT ► J'ai reçu le mouvement : ", movement);
            const objectMovement = movementsStore.getMovementById(movement);
            console.log("START_MOVEMENT ► mouvement store : ", movementsStore);
            console.log("START_MOVEMENT ► Objet retrouvé avec l'id : ", objectMovement);
            setMovementRequiered(objectMovement);
            setRoomId(roomId);
            setNumeroPlayer(numeroPlayer);
            // setHasMovement(true);
            // startMotion();
        }
    });

    return (
        <main className="h-screen w-screen flex flex-col justify-center items-center bg-slate-700 gap-6">
            <h1 className="text-3xl text-pink-600">Le jeu est lancé</h1>
            <h2 className="text-xl text-pink-200">{isChronoStarted && countdown ? countdown : ''}</h2>
            {movementRequired && (
                <div className="flex flex-col gap-6 justify-center items-center">
                    <p className="text-lg text-white">Mouvement attendu : {movementRequired}</p>
                    <p className="text-lg text-white">Mouvement reconnu : {movementRecognized}</p>
                    <div className="flex flex-col gap-2">
                        <p className='text-white'>alpha : {Math.round(orientationData.alpha * 100) / 100}</p>
                        <p className='text-white'>beta : {Math.round(orientationData.beta * 100) / 100}</p>
                        <p className='text-white'>gamma : {Math.round(orientationData.gamma * 100) / 100}</p>
                    </div>
                    {/* <button className="bg-slate-400 hover:bg-slate-500 h-fit p-8 rounded" onMouseDown={() => setMovementRunning(true)} onMouseUp={() => setMovementRunning(false)} onMouseLeave={() => setMovementRunning(false)}> */}
                    <button className="bg-slate-400 hover:bg-slate-500 h-fit p-8 rounded" onClick={startMotion}>
                        {isMovementRunning ? "En cours" : "Commencer"}
                    </button>

                    <button className="bg-slate-400 hover:bg-slate-500 h-fit p-8 rounded" onClick={stopMotion}>
                        Arrêter
                    </button>
                </div>
            )}
        </main>
    )
}
export default Game;

