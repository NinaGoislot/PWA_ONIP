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
    _type;
    _orientation;
    _direction;


    // Constructeur
    constructor(id, description, image, threshold, timer, point_per_moves, repeat, type, orientation, direction ) {
        this._id = id;
        this._description = description;
        this._image = image;
        this._threshold = threshold;
        this._timer = timer;
        this._point_per_moves = point_per_moves;
        this._repeat = repeat;
        this._type = type;
        this._orientation = orientation;
        this._direction = direction;
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
    get type() { return this._type; }
    get orientation() { return this._orientation; }
    get direction() { return this._direction; }

    // Accesseurs d'écriture
    set threshold(threshold) { this._threshold = threshold; }
    set repeat(repeat) { this._repeat = repeat; }
    set point_per_moves(point_per_moves) { this._point_per_moves = point_per_moves; }
    set orientation(orientation) { this._orientation = orientation; }
    set direction(direction) { this._direction = direction; }
}
export default Movements;