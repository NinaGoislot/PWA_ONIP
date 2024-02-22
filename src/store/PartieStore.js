import { makeAutoObservable } from "mobx";

class PartieStore {
    // Attributs
    _roomId;
    _numeroPlayer;

    // Constructeur
    constructor() {
        this._roomId = null;
        this._numeroPlayer = null;

        makeAutoObservable(this);
    }

    // Accesseur en lecture
    get roomId() {
        return this._roomId;
    }

    // Accesseur en écriture
    set roomId(roomId) {
        this._roomId = roomId;
    }

    // Accesseur en lecture
    get numeroPlayer() {
        return this._numeroPlayer;
    }

    // Accesseur en écriture
    set numeroPlayer(numeroPlayer) {
        this._numeroPlayer = numeroPlayer;
    }

    updateRoomAndPlayer(roomId, numeroPlayer) {
        this._roomId = roomId;
        this._numeroPlayer = numeroPlayer;
    }
}

export default PartieStore;
