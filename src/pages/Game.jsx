import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../App.jsx';
import { Link } from 'react-router-dom';
//import ml5 from 'https://unpkg.com/ml5@latest/dist/ml5.min.js';
import { socket } from "../socket";

import AOS from 'aos';
import 'aos/dist/aos.css';

function GameTest() {

    const MIN_POINTS = 70,
        THRESHOLD_PTS_REGISTERED = 20;

    const { movementsStore } = useContext(GlobalContext);
    const { partieStore } = useContext(GlobalContext);

    const navigate = useNavigate();

    //Infos du serveur
    const [movementRequired, setMovementRequiered] = useState("");

    //Chrono
    const [countdown, setCountdown] = useState(3);
    const [isChronoStarted, setChronoStarted] = useState(false);

    //Suivre la reconnaissance de mouvements  
    const [timer, setTimer] = useState("");
    const [timerDone, setTimerDone] = useState(false);
    
    const [isBeyondThreshold, setBeyondThreshold] = useState(false);
    const [isMovementRunning, setMovementRunning] = useState(false);

    //Données des mouvements
    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [finalData, setFinalData] = useState([]);
    const [accData, setAccData] = useState([]);

    /********************************************* USE EFFECT *********************************************/

    //Pour gérer l'ajout des évènements #1
    useEffect(() => {
        console.log('isMovementRunning',isMovementRunning);
        let score = 0;
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
            if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
                DeviceOrientationEvent.requestPermission();
            }

            return () => {
                console.log("L'écouteur d'évènements s'est arreté.'");
                window.removeEventListener('deviceorientation', handleOrientation);
                window.removeEventListener('devicemotion', handleMotion);
            };
        } else if (finalData.length > 1) { //Si j'ai récupéré des données avec orientationData

            console.log("finalData.length : " + finalData.length);

            // Vérifier si la longueur des données est suffisante pour la comparaison
            if (finalData.length < MIN_POINTS) {
                console.log("Mouvement trop court");
                setBeyondThreshold(false);
                setTimerDone(false);
                setFinalData("");
                socket.emit("MOVEMENT_DONE", score, partieStore.roomId, partieStore.numeroPlayer);
            } else {
                const objectMovement = movementsStore.getMovementById(movementRequired);
                let tabDataDone = normalizeData(finalData);
                tabDataDone = subSampleData(tabDataDone);
                tabDataDone = flattenData(tabDataDone);

                classifyData(tabDataDone).then(predictedMovement => {
                    console.log("Le mouvement reconnu est : ", predictedMovement);

                    if (predictedMovement == objectMovement.id) {
                        score = objectMovement.point_per_moves;
                        console.log("Points gagnés : " + score);
                    }
                    setFinalData("");
                    setBeyondThreshold(false);
                    setTimerDone(false);
                    console.log("Partie de partieStore : ", partieStore);
                    console.log("Room id : ", partieStore.roomId);
                    console.log("Numéro  : ", partieStore.numeroPlayer);
                    socket.emit("MOVEMENT_DONE", score, partieStore.roomId, partieStore.numeroPlayer);
                }).catch(error => {
                    console.error("Une erreur s'est produite lors de la classification :", error);
                });
            }
        }
        else if(timerDone) {
            console.log('dernier else');
            socket.emit("MOVEMENT_DONE", score, partieStore.roomId, partieStore.numeroPlayer);
        }
    }, [isMovementRunning]);

    //Stocker les données de direction et motion dans un tableau #2
    useEffect(() => {
        if (movementRequired) {
            // const higherThanThreshold = () => {
            //     const objectMovement = movementsStore.getMovementById(movementRequired);
            //     const seuil = objectMovement.threshold;

            //     let isHigher;
            //     if (!isBeyondThreshold) {
            //         if (Math.abs(motionData.acceleration.x) > seuil || Math.abs(motionData.acceleration.y) > seuil || Math.abs(motionData.acceleration.z) > seuil) {
            //             isHigher = true;
            //         } else { isHigher = false }
            //     } else if (Math.abs(motionData.acceleration.x) < seuil && Math.abs(motionData.acceleration.y) < seuil && Math.abs(motionData.acceleration.z) < seuil) {
            //         console.log("Je tombe en dessous du seuil.");
            //         isHigher = false;
            //     } else { isHigher = true }

            //     console.log(isHigher);
            //     return isHigher;
            // }

            const objectMovement = movementsStore.getMovementById(movementRequired);
            const seuil = objectMovement.threshold;
            let accData_copy = accData;
            let movementMean = 0;
            let currentMovementMagnitude = 0;
            accData_copy.push({ x: motionData.acceleration.x, y: motionData.acceleration.y, z: motionData.acceleration.z });

            if (accData_copy.length > THRESHOLD_PTS_REGISTERED) {
                accData_copy.shift();
            }

            //si j'ai 20 points dans mon tableau, je fais un tableau qui calcul chaque magnétude de chaque accélaration pour en faire une moyenne
            if (accData_copy.length == THRESHOLD_PTS_REGISTERED) {

                for (var i = 0; i < THRESHOLD_PTS_REGISTERED; i++) {
                    movementMean += calculateAccelerationMagnitude(accData_copy[i]);
                }
                currentMovementMagnitude = movementMean / THRESHOLD_PTS_REGISTERED;
            }

            const isHigher = currentMovementMagnitude > seuil;
            if (isHigher) {
                if (!isBeyondThreshold && isMovementRunning) {
                    //Si c'est la première fois que le seuil est dépassé pendant que le mouvement est en cours
                    setBeyondThreshold(true);
                } else {
                    //J'enregistre les données du mouvement
                    setFinalData(prevData => [...prevData, { x: orientationData.beta, y: orientationData.gamma, z: orientationData.alpha, accX: motionData.acceleration.x, accY: motionData.acceleration.y, accZ: motionData.acceleration.z, rotRateX: motionData.rotationRate.beta, rotRateY: motionData.rotationRate.gamma, rotRateZ: motionData.rotationRate.alpha }]);
                }
            } else {
                //Si je suis plus bas que le seuil après l'avoir déjà dépassé
                if (isBeyondThreshold) {
                    console.log("isBeyondThreshold pose pb");
                    stopProcess();
                }
            }
            setAccData(accData_copy);

            // console.log(isHigher);
            // return isHigher;


            // if (higherThanThreshold()) {
            //     //Si je dépasse le seuil
            //     if (!isBeyondThreshold && isMovementRunning) {
            //         //Si c'est la première fois que le seuil est dépassé pendant que le mouvement est en cours
            //         setBeyondThreshold(true);
            //     } else {
            //         //J'enregistre les données du mouvement
            //         setFinalData(prevData => [...prevData, { x: orientationData.beta, y: orientationData.gamma, z: orientationData.alpha, accX: motionData.acceleration.x, accY: motionData.acceleration.y, accZ: motionData.acceleration.z, rotRateX: motionData.rotationRate.beta, rotRateY: motionData.rotationRate.gamma, rotRateZ: motionData.rotationRate.alpha }]);
            //     }
            // } else {
            //     //Si je suis plus bas que le seuil après l'avoir déjà dépassé
            //     if (isBeyondThreshold) {
            //         stopProcess();
            //     }
            // }
        }

    }, [motionData, orientationData, isBeyondThreshold]);

    //Pour gérer le chrono d'avant jeu #3
    useEffect(() => {
        let countdownInterval;

        if (isChronoStarted && countdown > 0) {
            countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            const objectMovement = movementsStore.getMovementById(movementRequired);
            // console.log("ObjectMovement : ", objectMovement);
            console.log("ObjectMovement.timer : ", objectMovement.timer);
            setChronoStarted(false);

            if (objectMovement.timer > 0) {
                setTimer(objectMovement.timer); //UE#4
            }
            setMovementRunning(true); //UE#1 UE#4
        }

        return () => {
            clearInterval(countdownInterval);
        };
    }, [isChronoStarted, countdown]);

    //Pour gérer le timer pendant la simulation #4
    useEffect(() => {
        const objectMovement = movementsStore.getMovementById(movementRequired);
        let timerInterval;

        if (isMovementRunning && objectMovement.timer > 0) {
            if (timer > 0) {
                timerInterval = setInterval(() => {
                    setTimer((prevTimerMovement) => prevTimerMovement - 1);
                }, 1000);
            }
            if (timer == 0) {
                console.log("Le timer est fini");
                stopProcess();
            }
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [isMovementRunning, timer]);

    // Initialisation d'AOS
    useEffect(() => {
        AOS.init();
    }, []);

    /******************************************* SOCKET ********************************************/
    //J'ai chargé la page
    useEffect(() => {
        socket.emit("MOBILE_READY", partieStore.roomId, partieStore.numeroPlayer);
    }, []);

    //Je reçois le mouvement
    useEffect(() => {
        console.log("Je passe dans le useEffect");

        const handleStartMovement = (movement) => {
            console.log("START_MOVEMENT ► J'ai reçu le mouvement : ", movement);
            setMovementRequiered(movement);
            setTimerDone(false);
            startProcess();
        };

        socket.on("START_MOVEMENT", handleStartMovement);

        return () => {
            socket.off("START_MOVEMENT", handleStartMovement);
        };
    }, []);

    //Je reçois l'annonce de fin des mouvements
    useEffect(() => {
        const handleStartServing = () => {
            console.log("change vers le serve")
            navigate("/Serve");
        };

        socket.on("MOVEMENTS_FINISHED", handleStartServing);

        return () => {
            socket.off("MOVEMENTS_FINISHED", handleStartServing);
        };
    }, []);

    useEffect(() => {
        const handleStopServing = () => {
            console.log("change vers le wait")
            navigate("/Wait");
        };

        socket.on("STOP_MOVEMENT", handleStopServing);

        return () => {
            socket.off("STOP_MOVEMENT", handleStopServing);
        };
    }, []);

    /***************************************** Évènements ******************************************/
    const handleMotion = (event) => {
        const { acceleration, rotationRate } = event;
        setMotionData({ acceleration, rotationRate }); //UE#2
        //setAccData(accData.push({ x: acceleration.x, y: acceleration.y, z: acceleration.z })); //UE#2
    };

    const handleOrientation = (event) => {
        const { alpha, beta, gamma } = event;
        setOrientationData({ alpha, beta, gamma }); //UE#2
    };


    /****************************************** FONCTIONS ******************************************/
    const startProcess = () => {
        console.log("startProcess() ► Je démarre tout le processus");
        // Vérifier si l'API Vibration est prise en charge par le navigateur
        if ("vibrate" in navigator) {
            navigator.vibrate([200, 100, 200]); // Un tableau de motifs de vibration. Le chiffre du milieu représente une pause en ms
        } else {
            console.log("L'API Vibration n'est pas prise en charge par ce navigateur.");
        }
        setChronoStarted(true); // UE#3
    };

    const stopProcess = () => {
        console.log("stopProcess() ► J'arrête le processus.")

        setCountdown(3);
        setMovementRunning(false);
        setTimerDone(true);
    };

    //calcul de la magnitude du vecteur de l'accélérometre ** (exposant)
    function calculateAccelerationMagnitude(accelData) {
        const magnitude = Math.sqrt(accelData.x ** 2 + accelData.y ** 2 + accelData.z ** 2);
        return magnitude;
    }

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
    function subSampleData(data, rate = MIN_POINTS) {
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
        console.log("Classification en cours...");

        return new Promise((resolve, reject) => {
            const knnClassifier = ml5.KNNClassifier();
            knnClassifier.load('../myGestures-70.json', () => {
                console.log('Données d\'entraînement chargées avec succès.');

                // Classer les données avec le modèle KNN
                knnClassifier.classify(data, (error, result) => {
                    if (error) {
                        reject(error); // Rejeter la promesse en cas d'erreur
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
                    resolve(recognizedMovement); // Résoudre la promesse avec le mouvement prédit
                });
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

    return (
        <main className="relative h-screen w-screen flex flex-col justify-center items-center gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/tel-swipe.webp')" }}>
            <div className={`${!isMovementRunning ? 'absolute h-screen w-screen bg-black opacity-60' : 'hidden'}`}></div>
            <div className={`${!isMovementRunning ? "overflow-hidden" : ""} flex w-full h-full flex-col justify-around item-center relative `}>
                {!isMovementRunning && (<h1 className="text-3xl text-center text-black text-opacity-50">En attente d'instructions...</h1>)}
                {countdown > 0 && isChronoStarted && (<h2 className="text-6xl text-center text-light opacity-85">Prêt ?</h2>)}
                {isChronoStarted && (<h2 className="text-6xl text-center text-light opacity-85">{countdown}</h2>)}
                {isMovementRunning && (
                    <div className="relative h-full w-full flex justify-center items-center">
                        <h1 data-aos="fade-left"  className="text-7xl italic font-semibold text-light">Bouge ! </h1>
                        <div className="flex flex-col justify-between items-center w-full h-full absolute">
                            <img className="w-fit block h-[10%] transform scale-x-[-1]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                            <img className="w-fit block h-[10%]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                        </div>
                    </div>
                    // <div className="flex flex-col gap-6 justify-center items-center">
                    //     <p className="text-lg text-white">Mouvement attendu : {movementRequired}</p>
                    //     <div className="flex flex-col gap-2">
                    //         <p className='text-white'>alpha : {Math.round(orientationData.alpha * 100) / 100}</p>
                    //         <p className='text-white'>beta : {Math.round(orientationData.beta * 100) / 100}</p>
                    //         <p className='text-white'>gamma : {Math.round(orientationData.gamma * 100) / 100}</p>
                    //     </div>
                    //     <button className="bg-slate-400 hover:bg-slate-500 h-fit p-8 rounded" onClick={stopProcess}>
                    //         Arrêter
                    //     </button>
                    // </div>
                )}
            </div>
        </main>
    )
}
export default GameTest;

