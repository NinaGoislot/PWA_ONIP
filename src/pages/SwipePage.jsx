import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';

function SwipePage() {

    const [canMove, setCanMove] = useState(false);
    const navigate = useNavigate();
    const { partieStore } = useContext(GlobalContext);
    const [startX, setStartX] = useState(null);
    const [endX, setEndX] = useState(null);

    const swipeThreshold = 150;

    // Initialisation d'AOS
    useEffect(() => {
        AOS.init();
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
        socket.emit("NAVIGATE_CABINETSCENE", partieStore.roomId, partieStore.numeroPlayer);
    };

    const handleSwipeRight = () => {
        console.log("Swiped right!");
        socket.emit("NAVIGATE_CABINETSCENE", partieStore.roomId, partieStore.numeroPlayer);
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
        <main className="relative h-screen w-screen flex flex-col justify-center items-center gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/tel-swipe.webp')" }}>
            <div className={`flex w-full h-full flex-col gap-6 justify-center items-center`}>
                <div onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="relative h-full w-full flex flex-col justify-center items-center">
                        <img data-aos="fade-left" className="" src="/PWA/pictures/texte-balaie.webp" alt="" />
                        <button onClick={handleSwipeLeft} type="button" className="z-30 bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-4 rounded transition-all transform ease-in-out">Ouvrir l'amoire</button>
                        <div className="flex flex-col justify-between items-center w-full h-full absolute z-[-1]">
                            <img className="w-fit block h-[10%] transform scale-x-[-1]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                            <img className="w-fit block h-[10%]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default SwipePage;