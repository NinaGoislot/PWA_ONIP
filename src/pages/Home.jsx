import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";

function Home() {

    const THRESHOLD_PTS_REGISTERED = 3;
    const [connected, setConnected] = useState(false);
    const [needToVerify, setNeedToVerify] = useState(false);
    const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [orientationTab, setOrientationTab] = useState([]);
    const navigate = useNavigate();

    //afficher l'état de connection au départ
    socket.on("CONNECTED", () => {
        console.log("Connexion au serveur réussie");
        setConnected(true);
    });

    useEffect(() => {
        if (window.DeviceOrientationEvent) {
            console.log("DeviceOrientationEvent is supported");

            // Demander la permission d'accéder au mouvement du dispositif (s'il est nécessaire)
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            console.log("Permission accordée pour accéder au mouvement du dispositif");
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            console.log("Permission refusée pour accéder au mouvement du dispositif");
                            alert("Impossible de jouer à One Night In Paradoxe sans autoriser la reconnaissance des capteurs.");
                        }
                    })
                    .catch(console.error);
            } else {
                console.log("Pas besoin de demander la permission pour accéder au mouvement du dispositif");
                window.addEventListener('deviceorientation', handleOrientation);
            }
        } else {
            alert("Ce navigateur n'est pas compatible.");
        }
    }, [needToVerify]);

    //Vérifier si l'utilisateur à des points
    useEffect(() => {
        if (needToVerify && orientationData) {
            let orientationTab_copy = orientationTab;
            let movementMean = 0;
            let currentMovementMagnitude = 0;
            console.log("orientationData copy :", orientationTab_copy);
            console.log("orientationData alpha:", orientationData.alpha);

            orientationTab_copy.push({ alpha: orientationData.alpha, beta: orientationData.beta, gamma: orientationData.gamma });

            if (orientationData.alpha == null && orientationData.beta == null && orientationData.gamma == null) {
                orientationTab_copy.push({ alpha: 0, beta: 0, gamma: 0 });
            }

            if (orientationTab_copy.length > THRESHOLD_PTS_REGISTERED) {
                orientationTab_copy.shift();
            }

            //si j'ai 10 points dans mon tableau, je fais un tableau qui calcul chaque magnétude de chaque accélaration pour en faire une moyenne
            if (orientationTab_copy.length == THRESHOLD_PTS_REGISTERED) {
                for (var i = 0; i < THRESHOLD_PTS_REGISTERED; i++) {
                    movementMean += calculateOrientationMagnitude(orientationTab_copy[i]);
                }
                currentMovementMagnitude = movementMean / THRESHOLD_PTS_REGISTERED;

                console.log(currentMovementMagnitude < 0 || currentMovementMagnitude > 0);
                const hasPoints = currentMovementMagnitude < 0 || currentMovementMagnitude > 0 ;
                window.removeEventListener('deviceorientation', handleOrientation);
                console.log("Moyenne : ",currentMovementMagnitude);
                if (hasPoints) {
                   navigate("/ConnectPhone");
                } else {
                    alert("Impossible d'accéder aux capteurs. Essayez avec un autre appareil ou changez de navigateur.");
                }
            } 
            setOrientationTab(orientationTab_copy);
        }
    }, [orientationData]);

    function calculateOrientationMagnitude(data) {
        const magnitude = Math.sqrt(data.alpha ** 2 + data.beta ** 2 + data.gamma ** 2);
        return magnitude;
    }

    const handleOrientation = (event) => {
        const { alpha, beta, gamma } = event;
        setOrientationData({ alpha, beta, gamma }); 
    };


    const testCompatibility = () => {
        setNeedToVerify(true);
    };

    return (
        <main className="h-screen w-screen flex flex-col justify-between items-center bg-center" style={{ backgroundImage: "url('/PWA/pictures/connexion.webp')", backgroundSize: '100% 100%' }}>
            <div className="h-[20%] w-full bg-contain rotate-180" style={{ backgroundImage: "url('/PWA/pictures/zone-violette.webp')", backgroundSize: '100% 100%' }}></div>
            <div className="flex flex-col gap-16 px-4">
                <h1 className="text-3xl text-center text-light">Bienvenue sur l'application One Night In Paradoxe ! </h1>
                {connected && (
                    <Link to="" onClick={testCompatibility} className="mx-auto w-5/6 h-auto"><img src="/PWA/pictures/btn-connecter.svg" alt="Bouton de connexion" /></Link>
                )}
                <Link to="/Options" className="mx-auto w-1/2 h-auto"><img src="/PWA/pictures/btn-options.svg" alt="Bouton de connexion" /></Link>
            </div>
            <div className="h-[20%] w-full bg-contain" style={{ backgroundImage: "url('/PWA/pictures/zone-violette.webp')", backgroundSize: '100% 100%' }}></div>
        </main>
    )
}
export default Home;