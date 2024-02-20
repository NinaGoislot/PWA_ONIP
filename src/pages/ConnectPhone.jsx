import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "../socket";

function ConnectPhone() {

    const [start, setStart] = useState(false);
    const [infos, setInfos] = useState("Entre le code de partie");
    const navigate = useNavigate();

    // const handleJoinClick = () => {
    //     if (roomId.trim() === "") {
    //         setInfos("Veuillez entrer un code de partie.");
    //     } else {
    //         socket.emit("JOIN_GAME_MOBILE", roomId);
    //     }
    // };

    function submit(event) {
        event.preventDefault(); //Éviter un rechargement de la page
        const formData = new FormData(event.target);
        const roomId = formData.get("roomId");
        socket.emit("JOIN_GAME_MOBILE", roomId);
    }

    //   const search = (formData) => {
    //     const query = formData.get("query");
    //     alert(`Vous avez recherché « ${query} »`);
    // };

    //si mauvais game id
    socket.on("BAD_GAME_ID_MOBILE", () => {
        setInfos("Le code n'est pas bon");
    });

    //si plus de deux clients
    socket.on("ALREADY_MANETTE_MOBILE", () => {
        setInfos("Un téléphone est déjà connecté à ce joueur");
    });

    socket.on("READY_TO_PLAY", () => {
        setInfos("Shaker connecté !");
        navigate("/Game");
    });


    // socket.on("GO_PLAY", () => {
    //     lobby.setAttribute('hidden', '');
    //     partie.removeAttribute('hidden');
    // });

    // socket.on("GO_PLAY_SOLO", () => {
    //     console.log('solo')
    //     lobby.setAttribute('hidden', '');
    //     partie.removeAttribute('hidden');
    // });

    return (
        <main className="h-screen w-screen flex flex-col justify-center items-center bg-slate-700 gap-6">
            <h1 className="text-3xl text-center text-blue-600">{infos}</h1>
            {!start && (
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="flex flex-col  text-xl text-white">
                        <label htmlFor="roomId">Code de connexion</label>
                        <input className="text-black p-2" type="text" name="roomId" id="roomId" required="required" minLength="5" maxLength="5" />
                    </div>
                    <button type="submit" className="bg-slate-400 hover:bg-slate-500 w-fit h-fit p-4 rounded">Se connecter</button>
                </form>
            )}
        </main>
    )
}
export default ConnectPhone;