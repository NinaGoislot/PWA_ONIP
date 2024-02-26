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
        <main className="h-screen w-screen flex flex-col justify-center items-center bg-slate-700 gap-6 bg-cover bg-center"  style={{ backgroundImage: "url('/PWA/pictures/tel-swipe.webp')" }}>
            <h1 className="text-4xl text-center text-light">Bienvenue sur l'application One Night In Paradoxe ! </h1>
            <Link to="/Options"><button className="bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-4 rounded transition-all transform ease-in-out">Options</button></Link>
            {connected && (
                <Link to="/ConnectPhone"><button className="bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-4 rounded transition-all transform ease-in-out">Connecter son téléphone</button></Link>
            )}
        </main>
    )
}
export default Home;