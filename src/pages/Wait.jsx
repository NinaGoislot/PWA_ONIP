import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
//import { Swipeable } from 'react-swipeable';
//import {SwipeableViews} from 'react-swipeable-views-react-18-fix';

import AOS from 'aos';
import 'aos/dist/aos.css';

function Wait() {

    const [canMove, setCanMove] = useState(true);
    const [startX, setStartX] = useState(null);
    const [endX, setEndX] = useState(null);
    const swipeThreshold = 150;
    const navigate = useNavigate();
    const { partieStore } = useContext(GlobalContext);

    //Le jeu commence, je peux swipe
    useEffect(() => {
        const handleSwipeActive = () => {
            //navigate("/Serve", { roomId: roomId, numeroPlayer: numeroPlayer });
            console.log("j'active le tactile dans Wait")
            setCanMove(true);
        };

        socket.on("CABINET_SWIPE_ON", handleSwipeActive);

        return () => {
            socket.off("CABINET_SWIPE_ON", handleSwipeActive);
        };
    }, []);

    useEffect(() => {
        const navigateToWait = () => {
            console.log("Fin du temps après servir --> wait instructions")
            // navigate("/Wait");
        };

        socket.on("COUNTDOWN_TO_SERVE_FINISHED", navigateToWait);

        return () => {
            socket.off("COUNTDOWN_TO_SERVE_FINISHED", navigateToWait);
        };
    }, []);

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
        const sens = "droite";
        socket.emit("SWIPE_CABINET", partieStore.roomId, partieStore.numeroPlayer, sens);
        navigate("/Cabinet");
    };

    const handleSwipeRight = () => {
        console.log("Swiped right!");
        const sens = "gauche";
        socket.emit("SWIPE_CABINET", partieStore.roomId, partieStore.numeroPlayer, sens);
        navigate("/Cabinet");
    };

    return (
        <main className="relative h-screen w-screen flex flex-col justify-center items-center gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/tel-swipe-fond.webp')" }}>
            <div className={`${!canMove ? 'absolute h-screen w-screen bg-black opacity-60 z-40' : 'hidden'}`}></div>
            <div className={`${!canMove ? "overflow-hidden" : ""} flex w-full h-full flex-col gap-6 justify-center items-center`}>
                {!canMove && (<h1 className="text-5xl text-center text-light">Suis les instructions sur l'ordinateur !</h1>)}
                {canMove && (
                    <div
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <div className="relative h-full w-full flex flex-col justify-between items-center">
                            <img data-aos="fade-left" className="w-fit block h-[10%]" src="/PWA/pictures/fleche-swipe2.webp" alt="Swipe pour accéder à l'amoire à bouteilles" />

                            <img data-aos="fade-left" className="" src="/PWA/pictures/txt-balaie.webp" alt="" />
                            {/* <div className="flex flex-col justify-between items-center w-full h-full absolute z-[-1]">
                                <img className="w-fit block h-[10%] transform scale-x-[-1]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                                <img className="w-fit block h-[10%]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                            </div> */}
                            <img data-aos="fade-right" className="h-[10%]" src="/PWA/pictures/fleche-swipe.webp" alt="Swipe pour accéder à l'amoire à bouteilles" />

                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
export default Wait;