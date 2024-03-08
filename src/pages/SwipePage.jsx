import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';
import Deconnexion from "../components/Deconnexion";

function SwipePage() {

    const [canMove, setCanMove] = useState(false);
    const navigate = useNavigate();
    const { partieStore } = useContext(GlobalContext);
    const [startX, setStartX] = useState(null);
    const [endX, setEndX] = useState(null);
    const [canSwipe, setSwipe] = useState(false);

    const swipeThreshold = 50;

    // Initialisation d'AOS
    useEffect(() => {
        AOS.init();
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
        socket.emit("NAVIGATE_CABINETSCENE", partieStore.roomId, partieStore.numeroPlayer, sens);
    };

    const handleSwipeRight = () => {
        console.log("Swiped right!");
        const sens = "gauche";
        socket.emit("NAVIGATE_CABINETSCENE", partieStore.roomId, partieStore.numeroPlayer, sens);
    };

    /***************************************** SOCKET *****************************************/

    // Pour être synchro avec Phaser
    // useEffect(() => {
    //     const navigateCabinet = () => {
    //         navigate("/Cabinet");
    //     };

    //     socket.on("SWIPE_CABINET", navigateCabinet);

    //     return () => {
    //         socket.off("SWIPE_CABINET", navigateCabinet);
    //     };
    // }, []);

    useEffect(() => {
        const navigateCabinet = () => {
            navigate("/Cabinet");
        };
        socket.on("NAVIGATE_CABINETSCENE", navigateCabinet);

        return () => {
            socket.off("NAVIGATE_CABINETSCENE", navigateCabinet);
        };
    }, []);



    /******************************************************************************************/

    return (
        <Deconnexion>
            <main className="relative h-screen w-screen flex flex-col justify-center items-center gap-6 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/PWA/pictures/tel-swipe-fond.webp')" }}>
                {canSwipe && (
                    <div
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        className="flex w-full h-full flex-col gap-6 justify-center items-center"
                    >
                        <div className="relative h-full w-full flex flex-col justify-between items-center">
                            <img data-aos="fade-left" className="h-[10%]" src="/PWA/pictures/fleche-swipe-flip.svg" alt="Swipe pour accéder à l'amoire à bouteilles" />
                            <img data-aos="fade-left" className="" src="/PWA/pictures/txt-balaie.svg" alt="" />
                            <img data-aos="fade-right" className="h-[10%]" src="/PWA/pictures/fleche-swipe.svg" alt="Swipe pour accéder à l'amoire à bouteilles" />
                        </div>
                    </div>
                )}
            </main>
        </Deconnexion>
    )
}
export default SwipePage;