import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
//import { Swipeable } from 'react-swipeable';

import AOS from 'aos';
import 'aos/dist/aos.css';

function WaitFictive() {
    const location = useLocation();
    const navigate = useNavigate();
    const { partieStore } = useContext(GlobalContext);

    // Initialisation d'AOS
    useEffect(() => {
        AOS.init();
    }, []);


    const backToCabinet = () => {
        socket.emit("GO_TO_CABINET", partieStore.roomId, partieStore.numeroPlayer);
        navigate("/Cabinet");
    };

    return (
        <main className="relative h-screen w-screen flex flex-col justify-center items-center gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/tel-swipe.webp')" }}>
            <div className={`flex w-full h-full flex-col gap-6 justify-center items-center`}>
                <div className="relative h-full w-full flex flex-col justify-center items-center">
                    <img data-aos="fade-left" className="" src="/PWA/pictures/texte-balaie.webp" alt="" />
                    <button onClick={backToCabinet} type="button" className="z-30 bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-4 rounded transition-all transform ease-in-out">Ouvrir l'amoire</button>
                    <div className="flex flex-col justify-between items-center w-full h-full absolute z-[-1]">
                        <img className="w-fit block h-[10%] transform scale-x-[-1]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                        <img className="w-fit block h-[10%]" src="/PWA/pictures/fleche-swipe.webp" alt="" />
                    </div>
                </div>
            </div>
        </main>
    )
}
export default WaitFictive;