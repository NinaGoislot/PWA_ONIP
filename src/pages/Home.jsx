import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../App.jsx';
import { Link } from 'react-router-dom';

function Home() {

    return (
        <main className="h-screen w-screen flex justify-center items-center bg-slate-700">
                <Link to="/Test"><button className="bg-slate-400 h-20 p-8">Commencer les tests </button></Link>
                <Link to="/TestV2"><button className="bg-slate-400 h-20 p-8">version 2</button></Link>
        </main>
    )
}
export default Home;