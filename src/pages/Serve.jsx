import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
import Deconnexion from "../components/Deconnexion";

function Serve() {

    const { partieStore } = useContext(GlobalContext);
    const navigate = useNavigate();

    const serveCustomer = () => {
        console.log("click sur serveCustomer");
        socket.emit("SERVE_CUSTOMER", partieStore.roomId, partieStore.numeroPlayer);
        navigate("/Wait");
    };

    useEffect(() => {
        const navigateToWait = () => {
            console.log("Fin du jeu --> vers le wait")
            navigate("/Wait");
        };

        socket.on("GAME_OVER", navigateToWait);

        return () => {
            socket.off("GAME_OVER", navigateToWait);
        };
    }, []);

    useEffect(() => {
        const navigateToWait = () => {
            console.log("Fin du temps pour servir --> vers le wait")
            navigate("/Wait");
        };

        socket.on("COUNTDOWN_TO_SERVE_FINISHED", navigateToWait);

        return () => {
            socket.off("COUNTDOWN_TO_SERVE_FINISHED", navigateToWait);
        };
    }, []);

    return (
        <Deconnexion>
            <main className="h-screen w-screen flex flex-col justify-center items-center bg-slate-700 gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/ecran-servir-bg.webp')" }}>
                <img className="w-4/5 hover:scale-90 transition-all" src="/PWA/pictures/btn-servir.svg" alt="" onClick={serveCustomer} />
            </main>
        </Deconnexion>
    )
}
export default Serve;