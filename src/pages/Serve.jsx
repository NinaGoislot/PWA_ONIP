import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function Serve() {

    const { partieStore } = useContext(GlobalContext);
    const navigate = useNavigate();

    const serveCustomer = () => {
        console.log("click sur serveCustomer");
        socket.emit("SERVE_CUSTOMER", partieStore.roomId, partieStore.numeroPlayer);
        navigate("/Wait");
    };

    return (
        <main className="h-screen w-screen flex flex-col justify-center items-center bg-slate-700 gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/ecran-servir-bg.webp')" }}>
            <img className="w-fit block h-26 hover:scale-90 transition-all" src="/PWA/pictures/btn-servir.webp" alt="" onClick={serveCustomer} />
        </main>
    )
}
export default Serve;