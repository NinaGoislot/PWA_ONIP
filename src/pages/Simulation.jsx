import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../App.jsx';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

function Simulation() {

    const { movementsStore } = useContext(GlobalContext);
    const movements = movementsStore.movements;

    return (
        <main className="h-screen w-screen flex flex-col justify-center items-center bg-slate-700 p-4">
            <h1 className="w-full text-lg text-white text-center">Choisissez un mouvement à tester</h1>
            <div className="flex flex-wrap gap-4 justify-center w-full">
                {movements.map(movement => (
                    <Link key={movement.id} to={`/Simulation/${movement.id}`}>
                        <article className="flex flex-col gap-2 rounded bg-slate-300 hover:bg-slate-400 p-2">
                            <h2 className="font-bold text-center">{movement.id}</h2>
                            <p className="italic text-center">{movement.description}</p>
                        </article>
                    </Link>
                ))}
            </div>
        </main>
    )
}
export default observer(Simulation);