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
        console.log("Je submit le pseudo");
        event.preventDefault(); //Éviter un rechargement de la page
        const formData = new FormData(event.target);
        const roomId = formData.get("roomId");
        console.log("J'emit avec la room : " + roomId);
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

    const returnMenu = () => {
        navigate("/");
    };

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
        <main className="h-screen w-screen flex flex-col justify-between items-center bg-center" style={{ backgroundImage: "url('/PWA/pictures/connexion.webp')", backgroundSize: '100% 100%' }}>
            <div className="h-[20%] w-full bg-contain" onClick={returnMenu} style={{ backgroundImage: "url('/PWA/pictures/btn-retour.webp')", backgroundSize: '100% 100%' }}></div>
            <div className="flex flex-col gap-16 px-4">
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="flex flex-col justify-center text-xl text-white gap-6">
                        <label className="text-3xl text-light text-center" htmlFor="roomId">Entre le code de la partie</label>
                        <input className="tracking-[0.3em] text-black px-2 py-6 uppercase text-center rounded-[20px] border-2 border-white bg-[#8FA1C9] mx-6" type="text" name="roomId" id="roomId" required="required" minLength="5" maxLength="5" />
                    </div>
                </form>
            </div>
            <div className="h-[20%] w-full bg-contain flex items-end" style={{ backgroundImage: "url('/PWA/pictures/zone-violette.webp')", backgroundSize: '100% 100%' }}>
                <div className="h-[75%] flex justify-center items-center w-full">
                    <button type="submit" className="hover:scale-90 transition-all transform ease-in-out"><img src="/PWA/pictures/btn-valider.webp" alt="valider le code de la partie" /></button>
                </div>
            </div>
        </main>
    )
}
export default ConnectPhone;