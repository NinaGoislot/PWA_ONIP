import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
import Deconnexion from "../components/Deconnexion";

function PourBottle() {

    const { partieStore } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [isPouring, setIsPouring] = useState(false);
    const [alreadyPourOnce, setAlreadyPourOnce] = useState(false);
    const [angle, setAngle] = useState(false);

    //Je reçois l'annonce de fin des mouvements
    useEffect(() => {
        const handleStartGame = () => {
            console.log('PourBottle change to Game movement');
            navigate("/Game");
        };

        socket.on("POURING_FINISHED", handleStartGame);

        return () => {
            socket.off("POURING_FINISHED", handleStartGame);
        };
    }, []);

    //Je reçois l'annonce de fin des mouvements
    useEffect(() => {
        const goToCabinet = () => {
            navigate("/Cabinet");
        };

        socket.on("GO_TO_CABINET", goToCabinet);

        return () => {
            socket.off("GO_TO_CABINET", goToCabinet);
        };
    }, []);

    // Le joueur a été dévancé -> changement to next client
    useEffect(() => {
        const goToWait = () => {
            navigate("/Wait");
        };

        socket.on("CHANGE_TO_NEXT_CUSTOMER", goToWait);

        return () => {
            socket.off("CHANGE_TO_NEXT_CUSTOMER", goToWait);
        };
    }, []);

    //Écouteur d'évènement (Étape 1)
    useEffect(() => {
        const handleOrientationChange = event => {
            let tiltAngle = event.beta;
            if (tiltAngle < 0) {
                if (Math.abs(tiltAngle) > 90) {
                    console.log("Ancien angle d'inclinaison. ", tiltAngle);
                    tiltAngle = -(180 - Math.abs(tiltAngle));
                    console.log("Nouvel angle d'inclinaison. ", tiltAngle);
                }
            }
            setAngle(tiltAngle);
        };

        window.addEventListener('deviceorientation', handleOrientationChange);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientationChange);
        };
    }, []);

    //Détecter le versement (Étape 2)
    useEffect(() => {
        //Si je n'ai pas déjà versé
        if (!alreadyPourOnce) {
            if (angle < 0) {
                if (!isPouring) {
                    setIsPouring(true);
                    console.log("isPouring devient true");
                    socket.emit("IS_POURING_TRUE", true, partieStore.roomId, partieStore.numeroPlayer);
                } else if (isPouring) {
                    const normalizedSpeed = Math.abs(angle) / 90; // Convertir l'inclinaison en une valeur entre 0 et 1
                    const pourSpeed = normalizedSpeed * 0.1; // Normaliser entre 0 et 0.01
                    console.log("Angle après normalisation : ", pourSpeed);

                    socket.emit("POURING_SPEED", partieStore.roomId, partieStore.numeroPlayer, pourSpeed);
                }
            } else {
                if (isPouring) {
                    console.log("POURING ► L'angle est au dessus de 0 et je suis en train de verser: " + angle);
                    setIsPouring(false);
                    setAlreadyPourOnce(true);
                    console.log("isPouring devient false");
                    socket.emit("IS_POURING_FALSE", false, partieStore.roomId, partieStore.numeroPlayer);
                }
            }
        }
    }, [angle, alreadyPourOnce, isPouring]);

    return (
        <Deconnexion>
            <main className="h-screen w-screenp-0 m-0" style={{ backgroundImage: "url('/PWA/pictures/tel-bouteille-fond.webp')", backgroundSize: '100% 100%' }}>
                <div className="absolute bottom-0 left-0 w-full h-auto">
                    <img className="w-3/5 mx-auto translate-y-8" src="/PWA/pictures/bouteille-bouchon.webp" alt="Incline ton téléphone pour verser le liquide" />
                    <img className="w-full" src="/PWA/pictures/bouteille-sans-bouchon.webp" alt="Image du bouchon de la bouteille" />
                </div>
            </main>
        </Deconnexion>
    );
}
export default PourBottle;