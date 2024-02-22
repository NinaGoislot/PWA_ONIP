import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '@/App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "@/socket";

function Options() {

    return (
        <main className="relative h-screen w-screen flex flex-col gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/tel-swipe.webp')" }}>
            <Link to="/"><button className="bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-4 rounded transition-all transform ease-in-out absolute">← Retour</button></Link>

            <div className="flex mx-auto my-auto flex-col gap-6">
                <h1 className="text-3xl text-center text-light">Options du jeu</h1>
                <Link to="/Test"><button className="bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-4 rounded transition-all transform ease-in-out">Tester les capteurs</button></Link>
            </div>
        </main>
    )
}
export default Options;