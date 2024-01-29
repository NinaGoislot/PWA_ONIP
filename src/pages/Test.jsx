import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../App.jsx';
import { Link } from 'react-router-dom';

function Home() {

    return (
        <main className="h-screen w-screen flex flex-col justify-around item-center bg-slate-700">
            <div className="flex justify-center items-center h-full">
                    <Link to="/"><button className="bg-slate-400 h-20 p-8">Retourner a l'accueil </button></Link>
            </div>
            <div className="flex flex-col bg-slate-300 h-fit">
                <p>Afficher un truc</p>
            </div>
        </main>
    )
}
export default Home;