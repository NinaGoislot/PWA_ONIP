import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from './Modal';
import { socket } from "../socket";

function Deconnexion({ children }) {
    const [isDisconnected, setIsDisconnected] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('disconnect', () => {
            setIsDisconnected(true);
        });

        // Nettoyez les écouteurs d'événements lorsque le composant est démonté ou si nécessaire
        return () => {
            socket.off('disconnect');
        };
    }, []);

    const backToHome = () => {
        navigate("/");
    };

    return (
        <>
            {isDisconnected && (
                <Modal onClose={backToHome}>
                    <h1 className="text-3xl text-center">Vous avez été déconnecté du serveur.</h1>
                </Modal>
            )}
            <div className={`${!isDisconnected ? "overflow-hidden" : ""}`}>
                {children}
            </div>
        </>
    );
}

export default Deconnexion;
