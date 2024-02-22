import { makeAutoObservable } from "mobx";

class Movements {

    // Attributs
    _id;
    _description;
    _image;
    _threshold;
    _timer;
    _point_per_moves;
    _repeat;

    _idRoom;
    _nbPlayer;


    // Constructeur
    constructor(id, description, image, threshold, timer, point_per_moves, repeat ) {
        this._id = id;
        this._description = description;
        this._image = image;
        this._threshold = threshold;
        this._timer = timer;
        this._point_per_moves = point_per_moves;
        this._repeat = repeat;
        this._idRoom = 0;
        this._nbPlayer = 0;
        makeAutoObservable(this);
    }

    // Accesseurs de lecture
    get id() { return this._id; }
    get description() { return this._description; }
    get image() { return this._image; }
    get threshold() { return this._threshold; }
    get timer() { return this._timer; }
    get point_per_moves() { return this._point_per_moves; }
    get repeat() { return this._repeat; }
    get idRoom() { return this._idRoom; }
    get nbPlayer() { return this._nbPlayer; }

    // Accesseurs d'écriture
    set threshold(threshold) { this._threshold = threshold; }
    set repeat(repeat) { this._repeat = repeat; }
    set point_per_moves(point_per_moves) { this._point_per_moves = point_per_moves; }
    set idRoom(idRoom) { this._idRoom = idRoom; }
    set nbPlayer(nbPlayer) { this._nbPlayer = nbPlayer; }
}
export default Movements;