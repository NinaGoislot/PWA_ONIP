import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
//import { Swipeable } from 'react-swipeable';
import { useLocation } from 'react-router-dom';
import Deconnexion from "../components/Deconnexion";

function Cabinet() {
    const { partieStore } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [startX, setStartX] = useState(null);
    const [endX, setEndX] = useState(null);
    const [canSwipe, setSwipe] = useState(false);
    const swipeThreshold = 50;

    //Je reçois l'annonce de fin des mouvements
    useEffect(() => {
        const goToPour = () => {
            navigate("/PourBottle");
        };

        socket.on("GO_TO_POUR", goToPour);

        return () => {
            socket.off("GO_TO_POUR", goToPour);
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

    // Je peux swipe
    useEffect(() => {
        const canSwipe = () => {
            setSwipe(true);
        };

        socket.on("CAN_SWIPE", canSwipe);

        return () => {
            socket.off("CAN_SWIPE", canSwipe);
        };
    }, []);

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (startX && endX) {
            const distance = startX - endX;
            if (Math.abs(distance) >= swipeThreshold) {
                if (endX < startX) {
                    // Swiped left
                    handleSwipeLeft();
                } else if (endX > startX) {
                    // Swiped right
                    handleSwipeRight();
                }
            }
        }
        // Reset startX and endX
        setStartX(null);
        setEndX(null);
    };


    const handleSwipeLeft = () => {
        console.log("Swiped left!");
        const sens = "droite";
        socket.emit("NAVIGATE_FICTIVESCENE", partieStore.roomId, partieStore.numeroPlayer, sens);
    };

    const handleSwipeRight = () => {
        console.log("Swiped right!");
        const sens = "gauche";
        socket.emit("NAVIGATE_FICTIVESCENE", partieStore.roomId, partieStore.numeroPlayer, sens);
    };

    function sendMoveCursor(move) {
        socket.emit("MOVE_CURSOR", move, partieStore.roomId, partieStore.numeroPlayer);
    };

    /***************************************** SOCKET *****************************************/

    useEffect(() => {
        const navigateFictiveScene = () => {
            navigate("/SwipePage");
        };

        socket.on("NAVIGATE_FICTIVESCENE", navigateFictiveScene);

        return () => {
            socket.off("NAVIGATE_FICTIVESCENE", navigateFictiveScene);
        };
    }, []);

    const backToBottlesCard = () => {
        socket.emit("NAVIGATE_FICTIVESCENE", partieStore.roomId, partieStore.numeroPlayer, "droite");
    };


    /******************************************************************************************/

    return (
        <Deconnexion>
            <main className="relative h-screen w-screen flex flex-col justify-between items-center" style={{ backgroundImage: "url('/PWA/pictures/fond-manette.webp')", backgroundSize: '100% 100%' }}>
                <div className="h-[20%] w-full bg-contain transform transition-all hover:scale-80" onClick={backToBottlesCard} style={{ backgroundImage: "url('/PWA/pictures/btn-manette-retour.svg')", backgroundSize: '100% 100%' }}></div>
                {canSwipe && (
                    <div
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <div className="flex w-full h-full flex-col gap-10 justify-center items-center">
                            <div className="flex w-1/3 justify-center p-2">
                                <img onClick={() => sendMoveCursor("UP")} className="w-full scale-100 rotate-90 transform transition-transform duration-500 hover:scale-75" src="/PWA/pictures/cercle-validation.svg" alt="" />
                            </div>
                            <div className="flex gap-4 items-center">
                                <img onClick={() => sendMoveCursor("LEFT")} className="p-2 w-1/3 block scale-100 transform transition-transform duration-500 hover:scale-75" src="/PWA/pictures/cercle-validation.svg" alt="" />
                                <div className="flex w-1/3 justify-center">
                                    <img onClick={() => sendMoveCursor("CLICK")} className="w-full scale-100 transform transition-transform duration-500 hover:scale-75" src="/PWA/pictures/fleche-directionnelle.svg" alt="" />
                                </div>
                                <img onClick={() => sendMoveCursor("RIGHT")} className="w-1/3 p-2 scale-100 rotate-180 transform transition-transform duration-500 hover:scale-75" src="/PWA/pictures/cercle-validation.svg" alt="" />
                            </div>
                            <div className="flex w-1/3 justify-center p-2">
                                <img onClick={() => sendMoveCursor("DOWN")} className="scale-100 -rotate-90 transform transition-transform duration-500 hover:scale-75" src="/PWA/pictures/cercle-validation.svg" alt="" />
                            </div>
                        </div>
                    </div>
                )}
                <div className="h-[20%] w-full bg-contain" style={{ backgroundImage: "url('/PWA/pictures/zone-bouge.svg')", backgroundSize: '100% 100%' }}></div>
            </main >
        </Deconnexion>
    )
}
export default Cabinet;