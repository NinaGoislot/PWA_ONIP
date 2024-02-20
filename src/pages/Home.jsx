import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";

function Home() {

    const [connected, setConnected] = useState(false);
    const [infos, setInfos] = useState("Le téléphone n'est pas connecté au serveur");

    //afficher l'état de connection au départ
    socket.on("CONNECTED", () => {
        console.log("Connexion au serveur réussie");
        setConnected(true);
        setInfos("Connexion au serveur établie");
    });

    return (
        <main className="h-screen w-screen flex flex-col justify-center items-center bg-slate-700 gap-6">
            <h1 className="text-3xl text-center text-red-600">{infos}</h1>
            <Link to="/PWA/Test"><button className="bg-slate-400 hover:bg-slate-500 h-fit p-4 rounded">Voir les chiffres</button></Link>
            {connected && (
                <Link to="/PWA/ConnectPhone"><button className="bg-slate-400 hover:bg-slate-500 h-fit p-4 rounded">Connecter son téléphone</button></Link>
            )}
        </main>
    )
}
export default Home;