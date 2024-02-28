import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";

function PourBottle() {

    const { partieStore } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [isPouring, setIsPouring] = useState(false);
    const [hasPouring, setHasPouring] = useState(false);


    //Je reçois l'annonce de fin des mouvements
    useEffect(() => {
        const handleStartGame = () => {
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


    const startPour = () => {
        if(!hasPouring){
            console.log("POURING : ", true);
            socket.emit("POURING", true, partieStore.roomId, partieStore.numeroPlayer);
            setIsPouring(true);
        }
    };

    const stopPour = () => {
        if(!hasPouring){
            console.log("POURING : ", false);
            socket.emit("POURING", false, partieStore.roomId, partieStore.numeroPlayer);
            setIsPouring(false);
            setHasPouring(true);
        }
    };

    return (
        <main className="h-screen w-screen relative flex flex-col justify-center items-center gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/tel-bouteille-modele.webp')" }}>
            <div 
                className={`absolute bottom-0 h-[70%] w-full opacity-80`}
                onTouchStart={startPour}
                onTouchEnd={stopPour}
            ></div>
        </main>
    );
}
export default PourBottle;