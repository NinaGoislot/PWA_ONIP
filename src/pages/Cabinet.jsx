import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
//import { Swipeable } from 'react-swipeable';
import { useLocation } from 'react-router-dom';

function Cabinet() {
    const { partieStore } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [startX, setStartX] = useState(null);
    const [endX, setEndX] = useState(null);
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
        socket.emit("NAVIGATE_FICTIVESCENE", partieStore.roomId, partieStore.numeroPlayer);
    };

    const handleSwipeRight = () => {
        console.log("Swiped right!");
        socket.emit("NAVIGATE_FICTIVESCENE", partieStore.roomId, partieStore.numeroPlayer);
    };

    function sendMoveCursor(move) {
        socket.emit("MOVE_CURSOR", move, partieStore.roomId, partieStore.numeroPlayer);
    };

    /***************************************** SOCKET *****************************************/

    // useEffect(() => {
    //     const navigateFictiveScene = () => {
    //         navigate("/SwipePage");
    //     };

    //     socket.on("SWIPE_WAIT", navigateFictiveScene);

    //     return () => {
    //         socket.off("SWIPE_WAIT", navigateFictiveScene);
    //     };
    // }, []);

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
        socket.emit("NAVIGATE_FICTIVESCENE", partieStore.roomId, partieStore.numeroPlayer);
    };


    /******************************************************************************************/

    return (
        <main className="relative h-screen w-screen flex flex-col justify-between items-center" style={{ backgroundImage: "url('/PWA/pictures/fond-manette.webp')", backgroundSize: '100% 100%' }}>
            <div className="h-[20%] w-full bg-contain transform transition-all hover:scale-80" onClick={backToBottlesCard} style={{ backgroundImage: "url('/PWA/pictures/btn-manette-retour.svg')", backgroundSize: '100% 100%' }}></div>
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <div className="flex w-full h-full flex-col gap-10 justify-center items-center">
                    <div className="flex w-1/3 justify-center p-3">
                        <img onClick={() => sendMoveCursor("UP")} className="block scale-100 rotate-90 transform transition-transform duration-500 hover:scale-75" src="/PWA/pictures/cercle-validation.webp" alt="" />
                    </div>
                    <div className="flex gap-6 items-center">
                        <img onClick={() => sendMoveCursor("LEFT")} className="w-1/3 block scale-100 transform transition-transform duration-500 hover:scale-75" src="/PWA/pictures/cercle-validation.webp" alt="" />
                        <div className="flex w-1/3 justify-center p-1">
                            <img onClick={() => sendMoveCursor("CLICK")} className="block scale-100 transform transition-transform duration-500 hover:scale-75" src="/PWA/pictures/fleche-directionnelle.webp" alt="" />
                        </div>
                        <img onClick={() => sendMoveCursor("RIGHT")} className="w-1/3 block scale-100 rotate-180 transform transition-transform duration-500 hover:scale-75" src="/PWA/pictures/cercle-validation.webp" alt="" />
                    </div>
                    <div className="flex w-1/3 justify-center p-3">
                        <img onClick={() => sendMoveCursor("DOWN")} className="block scale-100 -rotate-90 transform transition-transform duration-500 hover:scale-75" src="/PWA/pictures/cercle-validation.webp" alt="" />
                    </div>
                </div>
            </div>
            <div className="h-[20%] w-full bg-contain" style={{ backgroundImage: "url('/PWA/pictures/zone-bouge.svg')", backgroundSize: '100% 100%' }}></div>
        </main >
    )
}
export default Cabinet;