import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";

function Home() {

    const [connected, setConnected] = useState(false);

    //afficher l'état de connection au départ
    socket.on("CONNECTED", () => {
        console.log("Connexion au serveur réussie");
        setConnected(true);
    });

    return (
        <main className="h-screen w-screen flex flex-col justify-between items-center bg-center" style={{ backgroundImage: "url('/PWA/pictures/connexion.webp')", backgroundSize: '100% 100%' }}>
            <div className="h-[20%] w-full bg-contain rotate-180" style={{ backgroundImage: "url('/PWA/pictures/zone-violette.webp')", backgroundSize: '100% 100%' }}></div>
            <div className="flex flex-col gap-16 px-4">
                <h1 className="text-3xl text-center text-light">Bienvenue sur l'application One Night In Paradoxe ! </h1>
                {connected && (
                    <Link to="/ConnectPhone" className="mx-auto"><img src="/PWA/pictures/btn-connecter.webp" alt="Bouton de connexion" /></Link>
                )}
                <Link to="/Options" className="mx-auto"><img src="/PWA/pictures/btn-options.webp" alt="Bouton de connexion" /></Link>
            </div>
            <div className="h-[20%] w-full bg-contain" style={{ backgroundImage: "url('/PWA/pictures/zone-violette.webp')", backgroundSize: '100% 100%' }}></div>
        </main>
    )
}
export default Home;