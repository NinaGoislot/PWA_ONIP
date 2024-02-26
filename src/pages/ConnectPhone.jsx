import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../App.jsx';
import { Link } from 'react-router-dom';
import { socket } from "../socket";

function ConnectPhone() {

    const [start, setStart] = useState(false);
    const [infos, setInfos] = useState("Entre le code de partie");
    const navigate = useNavigate();

    const { partieStore } = useContext(GlobalContext);

    // const handleJoinClick = () => {
    //     if (roomId.trim() === "") {
    //         setInfos("Veuillez entrer un code de partie.");
    //     } else {
    //         socket.emit("JOIN_GAME_MOBILE", roomId);
    //     }
    // };

    // function submit(event) {
    //     event.preventDefault(); //Éviter un rechargement de la page
    //     // Request permission for iOS 13+ devices
    //     if (
    //         DeviceMotionEvent &&
    //         typeof DeviceMotionEvent.requestPermission === "function"
    //     ) {
    //         DeviceMotionEvent.requestPermission();
    //     }
    //     const formData = new FormData(event.target);
    //     const roomId = formData.get("roomId");
    //     socket.emit("JOIN_GAME_MOBILE", roomId);
    // }

    function submit(event) {
        event.preventDefault(); //Éviter un rechargement de la page
        const formData = new FormData(event.target);
        const roomId = formData.get("roomId");
        socket.emit("JOIN_GAME_MOBILE", roomId);

        // Request permission for iOS 13+ devices
        // if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
        //     DeviceMotionEvent.requestPermission()
        //         .then(permissionState => {
        //             if (permissionState === 'granted') {
        //                 // Autorisation accordée
        //                 const formData = new FormData(event.target);
        //                 const roomId = formData.get("roomId");
        //                 socket.emit("JOIN_GAME_MOBILE", roomId);
        //             } else {
        //                 // L'autorisation a été refusée
        //                 console.log('Permission denied for Device Motion Events.');
        //             }
        //         })
        //         .catch(console.error);
        // } else {
        //     // Le navigateur ne supporte pas la demande d'autorisation
        //     console.log('Permission API not supported for Device Motion Events.');
        // }
    }

    //si mauvais game id
    socket.on("BAD_GAME_ID_MOBILE", () => {
        setInfos("Le code n'est pas bon");
    });

    //si plus de deux clients
    socket.on("ALREADY_MANETTE_MOBILE", () => {
        setInfos("Un téléphone est déjà connecté à ce joueur");
    });

    socket.on("READY_TO_PLAY", (numeroPlayer, roomId) => {
        console.log("CONNECT_PHONE ► Mon téléphone est connecté");
        partieStore.updateRoomAndPlayer(roomId, numeroPlayer);
        setInfos("Shaker connecté !");
        navigate("/Wait");
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
        <main className="h-screen w-screen flex flex-col justify-center items-center gap-6 bg-cover bg-center" style={{ backgroundImage: "url('/PWA/pictures/tel-swipe.webp')" }}>
            {!start && (
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="flex flex-col  text-xl text-white">
                        <label className="text-xl text-light" htmlFor="roomId">Code de partie</label>
                        <input className="text-black p-2" type="text" name="roomId" id="roomId" required="required" minLength="5" maxLength="5" />
                    </div>
                    <button type="submit" className="w-fit mx-auto bg-light bg-opacity-50 text-dark font-semibold text-xl hover:bg-opacity-100 hover:scale-110 h-fit p-4 rounded transition-all transform ease-in-out">Se connecter</button>
                </form>
            )}
        </main>
    )
}
export default ConnectPhone;