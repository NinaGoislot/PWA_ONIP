import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../App.jsx';
import { Link } from 'react-router-dom';
//import ml5 from 'https://unpkg.com/ml5@latest/dist/ml5.min.js';
import { socket } from "../socket";

function Game() {

    //Infos du serveur
    const [movementRequired, setMovementRequiered] = useState("");
    const [roomId, setRoomId] = useState("");
    const [numeroPlayer, setNumeroPlayer] = useState("");

    //Suivre la reconnaissance de mouvements
    const [movementRecognized, setMovementRecognized] = useState("");
    const [isMovementStarted, setMovementStarted] = useState(false);

    //Données des mouvements
    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [finalData, setFinalData] = useState([]);

    const knnClassifier  = ml5.KNNClassifier();
    knnClassifier.load('../myGestures-30.json', () => {
        //console.log('Données d\'entraînement chargées avec succès.');
    });

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
        if (isMovementStarted) {
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

            let tabDataDone = normalizeData(finalData);
            tabDataDone = subSampleData(tabDataDone);
            tabDataDone = flattenData(tabDataDone);

            const predictedMovement = classifyData(tabDataDone);
            console.log("Étape 4 ► Le mouvement reconnu est : ", predictedMovement);

            setMovementRecognized(predictedMovement);
            const isMovementCorrect = predictedMovement == movementRequired;
            setFinalData("");
            socket.emit("MOVEMENT_DONE", isMovementCorrect, roomId, numeroPlayer);
            setMovementStarted(false);
        }
    }, [isMovementStarted]);

    //Stocker les données de direction et motion dans un tableau
    useEffect(() => {
        setFinalData(prevData => [...prevData, { x: orientationData.beta, y: orientationData.gamma, z: orientationData.alpha, accX: motionData.acceleration.x, accY: motionData.acceleration.y, accZ: motionData.acceleration.z, rotRateX: motionData.rotationRate.beta, rotRateY: motionData.rotationRate.gamma, rotRateZ: motionData.rotationRate.alpha }]);
    }, [motionData, orientationData]);

    /***************************************** Évènements ******************************************/
    const handleMotion = (event) => {
        const { acceleration, rotationRate } = event;
        setMotionData({ acceleration, rotationRate });
    };

    const handleOrientation = (event) => {
        const { alpha, beta, gamma } = event;
        setOrientationData({ alpha, beta, gamma });
    };


    /****************************************** FONCTIONS ******************************************/
    const startMotion = () => {
        setMovementStarted(true);
    };

    const stopMotion = () => {
        setMovementStarted(false);
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
        // Classer les données avec le modèle KNN
        knnClassifier.classify(data, (error, result) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log("Résultat du classify : ", result)
            const resultsData = getLabel(result);
            // Récupérer le mouvement prédit
            const predictedMovement = resultsData.label;
            // Récupérer l'intervalle de confiance du mouvement prédit
            const confidenceInterval = Math.round(resultsData.confidence * 100) / 100; //arrondir
            // Afficher le résultat
            console.log('Mouvement prédit :', predictedMovement);
            console.log('Intervalle de confiance :', confidenceInterval);

            return predictedMovement;
        });
    }

    function getLabel(result, minConfidence = 50) {
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
        console.log("PWA ► J'ai reçu le mouvement : ", movement);
        setMovementRequiered(movement);
        setRoomId(roomId);
        setNumeroPlayer(numeroPlayer);
    });

    return (
        <main className="h-screen w-screen flex flex-col justify-center items-center bg-slate-700 gap-6">
            <h1 className="text-3xl text-pink-600">Le jeu est lancé</h1>
            <h2 className="text-xl text-pink-200">Mouvement attendu : {movementRequired}</h2>
            {movementRequired && (
                <div className="flex flex-col gap-6 justify-center items-center">
                    <p className="text-lg text-white">Mouvement attendu : {movementRequired}</p>
                    <p className="text-lg text-white">Mouvement reconnu : {movementRecognized}</p>
                    <div className="flex flex-col gap-2">
                        <p className='text-white'>alpha : {Math.round(orientationData.alpha * 100) / 100}</p>
                        <p className='text-white'>beta : {Math.round(orientationData.beta * 100) / 100}</p>
                        <p className='text-white'>gamma : {Math.round(orientationData.gamma * 100) / 100}</p>
                    </div>
                    {/* <button className="bg-slate-400 hover:bg-slate-500 h-fit p-8 rounded" onMouseDown={() => setMovementStarted(true)} onMouseUp={() => setMovementStarted(false)} onMouseLeave={() => setMovementStarted(false)}> */}
                    <button className="bg-slate-400 hover:bg-slate-500 h-fit p-8 rounded" onClick={startMotion}>
                        {isMovementStarted ? "En cours" : "Commencer"}
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

