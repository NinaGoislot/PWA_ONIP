import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
//import { Swipeable } from 'react-swipeable';

import AOS from 'aos';
import 'aos/dist/aos.css';

function Wait() {

    const [canMove, setCanMove] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [numeroPlayer, setNumeroPlayer] = useState("");

    const location = useLocation();
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

    // Initialisation d'AOS
    useEffect(() => {
        AOS.init();
    }, []);


    const handleSwipeLeft = () => {
        console.log("Swiped left!");
        socket.emit("SWIPE_CABINET", partieStore.roomId, partieStore.numeroPlayer);
        navigate("/Cabinet");
    };

    const handleSwipeRight = () => {
        console.log("Swiped right!");
        socket.emit("SWIPE_CABINET", partieStore.roomId, partieStore.numeroPlayer);
        navigate("/Cabinet");
    };

    return (
        <main className="relative h-screen w-screen flex flex-col justify-center items-center gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/tel-swipe.webp')" }}>
            <div className={`${!canMove ? 'absolute h-screen w-screen bg-black opacity-60 z-40' : 'hidden'}`}></div>
            <div className={`${!canMove ? "overflow-hidden" : ""} flex w-full h-full flex-col gap-6 justify-center items-center`}>
                {!canMove && (<h1 className="text-3xl text-center text-dark_">En attente d'instructions...</h1>)}
                {canMove && (
                    // <Swipeable onSwipedLeft={handleSwipeLeft} onSwipedRight={handleSwipeRight}>
                    //     <div className="relative h-full w-full flex justify-center items-center">
                    //         <img data-aos="fade-left" className="" src="/PWA/pictures/texte-balaie.webp" alt="" />
                    //         <div className="flex flex-col justify-between items-center w-full h-full absolute">
                    //             <img className="w-fit block h-[10%] transform scale-x-[-1]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                    //             <img className="w-fit block h-[10%]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                    //         </div>
                    //     </div>
                    // </Swipeable>
                    <div className="relative h-full w-full flex flex-col justify-center items-center">
                        <img data-aos="fade-left" className="" src="/PWA/pictures/texte-balaie.webp" alt="" />
                        <button onClick={handleSwipeLeft} type="button" className="z-30 bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-4 rounded transition-all transform ease-in-out">Ouvrir l'amoire</button>
                        <div className="flex flex-col justify-between items-center w-full h-full absolute z-[-1]">
                            <img className="w-fit block h-[10%] transform scale-x-[-1]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                            <img className="w-fit block h-[10%]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
export default Wait;