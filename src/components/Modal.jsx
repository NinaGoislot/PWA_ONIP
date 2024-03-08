import React, { useState, useEffect } from "react";

const Modal = ({ onClose, children }) => {


    return (
        <div className="fixed z-20 flex items-center justify-center h-screen w-screen">
            <div className="relative bg-white p-8 rounded-lg z-10 m-4">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
