import { makeAutoObservable } from "mobx";

class PartieStore {
    // Attributs
    _roomId;
    _numeroPlayer;

    // Constructeur
    constructor() {
        this._roomId = null;
        this._numeroPlayer = null;
        this._isOnPhase2 = null;

        makeAutoObservable(this);
    }

    // Accesseur en lecture
    get roomId() {
        return this._roomId;
    }
    get numeroPlayer() {
        return this._numeroPlayer;
    }
    get isOnPhase2() {
        return this._isOnPhase2;
    }

    // Accesseur en écriture
    set roomId(roomId) {
        this._roomId = roomId;
    }
    set numeroPlayer(numeroPlayer) {
        this._numeroPlayer = numeroPlayer;
    }
    set isOnPhase2(isOnPhase2) {
        this._isOnPhase2 = isOnPhase2;
    }

    updateRoomAndPlayer(roomId, numeroPlayer, isOnPhase2) {
        this._roomId = roomId;
        this._numeroPlayer = numeroPlayer;
        this._isOnPhase2 = isOnPhase2;
    }
}

export default PartieStore;
