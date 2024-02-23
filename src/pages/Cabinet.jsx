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

    const handleSwipeLeft = () => {
        console.log("Swiped left!");
        socket.emit("SWIPE_WAIT", partieStore.roomId, partieStore.numeroPlayer);
        navigate("/Wait");
    };

    const handleSwipeRight = () => {
        console.log("Swiped right!");
        socket.emit("SWIPE_WAIT", partieStore.roomId, partieStore.numeroPlayer);
        navigate("/Wait");
    };

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
    
    function sendMoveCursor(move) {
        socket.emit("MOVE_CURSOR", move,  partieStore.roomId, partieStore.numeroPlayer);
    };

    return (
        <main className="relative h-screen w-screen flex flex-col justify-center items-center gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/tel-manette-bg-V2.webp')" }}>
            {/* <Swipeable onSwipedLeft={handleSwipeLeft} onSwipedRight={handleSwipeRight}>
                <div className="flex w-full h-full flex-col gap-6 justify-center items-center">
                    <div className="flex">
                        <img className="w-fit block h-26 rotate-90 hover:scale-90 transition-all" src="/PWA/pictures/cercle-validation.webp" alt="" />
                    </div>
                    <div className="flex gap-6 items-center">
                        <img className="h-fit block w-26 hover:scale-90 transition-all" src="/PWA/pictures/cercle-validation.webp" alt="" />
                        <img className="w-fit block h-26 hover:scale-90 transition-all" src="/PWA/pictures/fleche-directionnelle.webp" alt="" />
                        <img className="h-fit block w-26 rotate-180 hover:scale-90 transition-all" src="/PWA/pictures/cercle-validation.webp" alt="" />
                    </div>
                    <div className="flex">
                        <img className="w-fit block h-26 -rotate-90 hover:scale-90 transition-all" src="/PWA/pictures/cercle-validation.webp" alt="" />
                    </div>
                </div>
            </Swipeable> */}
            <div className="flex w-full h-full flex-col gap-6 justify-center items-center">
                <div className="flex w-1/3 justify-center p-3">
                    <img onClick={() => sendMoveCursor("UP")} className="w-16 block scale-100 rotate-90 hover:scale-90 transition-all" src="/PWA/pictures/cercle-validation.webp" alt="" />
                </div>
                <div className="flex gap-6 items-center">
                    <img onClick={() => sendMoveCursor("LEFT")} className="w-16 block scale-100 hover:scale-90 transition-all" src="/PWA/pictures/cercle-validation.webp" alt="" />
                    <img onClick={() => sendMoveCursor("CLICK")} className="w-20 block scale-100 hover:scale-90 transition-all" src="/PWA/pictures/fleche-directionnelle.webp" alt="" />
                    <img onClick={() => sendMoveCursor("RIGHT")} className="w-16 block scale-100 rotate-180 hover:scale-90 transition-all" src="/PWA/pictures/cercle-validation.webp" alt="" />
                </div>
                <div className="flex w-1/3 justify-center p-3">
                    <img onClick={() => sendMoveCursor("DOWN")} className="w-16 block scale-100 -rotate-90 hover:scale-90 transition-all" src="/PWA/pictures/cercle-validation.webp" alt="" />
                </div>
            </div>
            
        </main >
    )
}
export default Cabinet;