import { makeAutoObservable } from "mobx";

class Movements {

    // Attributs
    _id;
    _description;
    _image;
    _thershold;
    _timer;
    _point_per_moves;
    _repeat;


    // Constructeur
    constructor(id, description, image, thershold, timer, point_per_moves, repeat ) {
        this._id = id;
        this._description = description;
        this._image = image;
        this._thershold = thershold;
        this._timer = timer;
        this._point_per_moves = point_per_moves;
        this._repeat = repeat;
        makeAutoObservable(this);
    }

    // Accesseurs de lecture
    get id() { return this._id; }
    get description() { return this._description; }
    get image() { return this._image; }
    get thershold() { return this._thershold; }
    get timer() { return this._timer; }
    get point_per_moves() { return this._point_per_moves; }
    get repeat() { return this._repeat; }

    // Accesseurs d'écriture
    set thershold(thershold) { this._thershold = thershold; }
    set repeat(repeat) { this._repeat = repeat; }
    set point_per_moves(point_per_moves) { this._point_per_moves = point_per_moves; }
}
export default Movements;