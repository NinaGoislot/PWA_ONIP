import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../App.jsx';
import { Link } from 'react-router-dom';

function Home() {

    return (
        <main className="h-screen w-screen flex justify-center items-center bg-slate-700 gap-6">
                <Link to="/Test"><button className="bg-slate-400 h-fit p-4 rounded">Voir les chiffres</button></Link>
                <Link to="/Simulation"><button className="bg-slate-400 h-fit p-4 rounded">faire une simulation</button></Link>
        </main>
    )
}
export default Home;