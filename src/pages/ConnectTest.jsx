import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "../socket";
import { observer } from 'mobx-react-lite';
import Modal from '../components/Modal';

function ConnectTest() {

    const [start, setStart] = useState(false);
    const [infos, setInfos] = useState("Entre le code de partie");
    const navigate = useNavigate();

    //**********************
    //---------------------
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
    const [simulationStart, setSimulation] = useState(false);
    const [nbMovements, setNbMovements] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTimerActive, setTimer] = useState(false);
    const [isTestOver, setTestOver] = useState(false);
    const [direction, setDirection] = useState("Aucune direction");

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

        if (previousX > 0) {
            if (newX < 0) {
                setNbMovements((prevNbMovements) => prevNbMovements + 1);
            }
        } else if (previousX < 0) {
            if (newX > 0) {
                setNbMovements((prevNbMovements) => prevNbMovements + 1);
            }
        }

        /*if (acceleration.x > 10) {
            setDirection("Ouest");
        } else if (acceleration.x < -10) {
            setDirection("Est");
        }

        if (acceleration.y > 10) {
            setDirection("Sud");
        } else if (acceleration.y < -10) {
            setDirection("Nord");
        }*/

        // Seuil pour considérer un mouvement significatif
        const threshold = 3;

        // Variable d'état pour suivre la direction actuelle
        let currentDirection = "Aucun mouvement significatif";

        // Logique de traitement
        if (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold) {
            if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
                // Mouvement horizontal
                currentDirection = acceleration.x > threshold ? "Est" : "Ouest";
            } else {
                // Mouvement vertical
                currentDirection = acceleration.y > threshold ? "Sud" : "Nord";

                // Logique de traitement pour les diagonales
                if (Math.abs(acceleration.x) > threshold && Math.abs(acceleration.y) > threshold) {
                    if (acceleration.x > threshold && acceleration.y > threshold) {
                        currentDirection = "Nord-Est";
                    } else if (acceleration.x > threshold && acceleration.y < threshold) {
                        currentDirection = "Sud-Est";
                    } else if (acceleration.x < threshold && acceleration.y > threshold) {
                        currentDirection = "Nord-Ouest";
                    } else if (acceleration.x < threshold && acceleration.y < threshold) {
                        currentDirection = "Sud-Ouest";
                    }
                }
            }
        }

        // Mettez à jour la direction seulement si un mouvement significatif a été détecté
        if (currentDirection !== "Aucun mouvement significatif") {
            setDirection(currentDirection);
        }

        if (currentDirection == "Ouest" || currentDirection == "Est") {
            setNbMovements((prevNbMovements) => prevNbMovements + 1);
        }

        setBestDataX((prevX) => Math.round(acceleration.x * 100) / 100 > prevX ? Math.round(acceleration.x * 100) / 100 : prevX);
        setBestDataY((prevY) => Math.round(acceleration.y * 100) / 100 > prevY ? Math.round(acceleration.y * 100) / 100 : prevY);
        setBestDataZ((prevZ) => Math.round(acceleration.z * 100) / 100 > prevZ ? Math.round(acceleration.z * 100) / 100 : prevZ);

        setBestDataX2((prevX2) => Math.round(acceleration.x * 100) / 100 < prevX2 ? Math.round(acceleration.x * 100) / 100 : prevX2);
        setBestDataY2((prevY2) => Math.round(acceleration.y * 100) / 100 < prevY2 ? Math.round(acceleration.y * 100) / 100 : prevY2);
        setBestDataZ2((prevZ2) => Math.round(acceleration.z * 100) / 100 < prevZ2 ? Math.round(acceleration.z * 100) / 100 : prevZ2);

    };

    useEffect(() => {
        if (isTestOver) {
            setHigherX(dataX);
            setHigherY(dataY);
            setHigherZ(dataZ);

            setLowerX(dataX2);
            setLowerY(dataY2);
            setLowerZ(dataZ2);
        }
    }, [isTestOver, dataX, dataY, dataZ, dataX2, dataY2, dataZ2]);

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

        // Request permission for iOS 13+ devices
        if (
            DeviceMotionEvent &&
            typeof DeviceMotionEvent.requestPermission === "function"
        ) {
            DeviceMotionEvent.requestPermission();
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, []);

    
    //---------------------
    //**********************

    const { partieStore } = useContext(GlobalContext);

    function submit(event) {
        event.preventDefault(); //Éviter un rechargement de la page
        const formData = new FormData(event.target);
        const roomId = formData.get("roomId");
        socket.emit("JOIN_GAME_MOBILE", roomId);
    }

    //si mauvais game id
    socket.on("BAD_GAME_ID_MOBILE", () => {
        setInfos("Le code n'est pas bon");
    });

    //si plus de deux clients
    socket.on("ALREADY_MANETTE_MOBILE", () => {
        setInfos("Un téléphone est déjà connecté à ce joueur");
    });

    socket.on("READY_TO_PLAY", (numeroPlayer, roomId) => {
        console.log("CONNECT_PHONE ► Mon téléphone est connecté");
        partieStore.updateRoomAndPlayer(roomId, numeroPlayer);
        setInfos("Shaker connecté !");
        navigate("/Wait");
    });

    return (
        <main className="h-screen w-screen flex flex-col justify-center items-center gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/tel-swipe.webp')" }}>
            {!start && (
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="flex flex-col  text-xl text-white">
                        <label className="text-xl text-light" htmlFor="roomId">Code de partie</label>
                        <input className="text-black p-2" type="text" name="roomId" id="roomId" required="required" minLength="5" maxLength="5" />
                    </div>
                    <button type="submit" className="w-fit mx-auto bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-4 rounded transition-all transform ease-in-out">Se connecter</button>
                </form>
            )}
             {simulationStart && (
                <Modal onClose={closeModal}>
                    <h2 className="text-xl font-bold mb-4 text-red-500">{displayText}</h2>
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
            <div className={`${simulationStart ? "overflow-hidden" : ""} flex w-full h-full flex-col justify-around item-center relative `}>
                <div className="absolute flex gap-4 mx-auto top-0">
                    <Link to="/"><button className="bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-2 rounded transition-all transform ease-in-out">Retourner à l'accueil</button></Link>
                    <button onClick={openModal} className="bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-2 rounded transition-all transform ease-in-out">
                        Démarrer la simulation
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center w-full">
                    <h2 className="font-bold text-2xl text-white w-full text-center">{direction}</h2>
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
                    <div className="flex flex-col bg-slate-300 h-fit w-full">
                        {orientationData && (
                            <div>
                                <p>Alpha: {orientationData.alpha}</p>
                                <p>Beta: {orientationData.beta}</p>
                                <p>Gamma: {orientationData.gamma}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col bg-red-300 h-fit w-full">
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
            </div>
        </main>
    )
}
export default ConnectTest;