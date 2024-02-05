import { makeAutoObservable } from "mobx";

class Movements {

    // Attributs
    _id;
    _description;
    _image;
    _type;
    _api;
    _thershold_general;
    _thershold_penality;
    _timer;
    _repeat;
    _point_per_moves;
    _direction;


    // Constructeur
    constructor(id, description, image, type, api, thershold_general, thershold_penality, timer, repeat, point_per_moves, direction ) {
        this._id = id;
        this._description = description;
        this._image = image;
        this._type = type;
        this._api = api;
        this._thershold_general = thershold_general;
        this._thershold_penality = thershold_penality;
        this._timer = timer;
        this._repeat = repeat;
        this._point_per_moves = point_per_moves;
        this._direction = direction;
        makeAutoObservable(this);
    }

    // Accesseurs de lecture
    get id() { return this._id; }
    get description() { return this._description; }
    get image() { return this._image; }
    get type() { return this._type; }
    get api() { return this._api; }
    get thershold_general() { return this._thershold_general; }
    get thershold_penality() { return this._thershold_penality; }
    get timer() { return this._timer; }
    get repeat() { return this._repeat; }
    get point_per_moves() { return this._point_per_moves; }
    get direction() { return this._direction; }

    // Accesseurs d'écriture
    set description(description) { this._description = description; }
    set image(image) { this._image = image; }
    set type(type) { this._type = type; }
    set api(api) { this._api = api; }
    set thershold_general(thershold_general) { this._thershold_general = thershold_general; }
    set thershold_penality(thershold_penality) { this._thershold_penality = thershold_penality; }
    set timer(timer) { this._timer = timer; }
    set repeat(repeat) { this._repeat = repeat; }
    set point_per_moves(point_per_moves) { this._point_per_moves = point_per_moves; }
    set direction(direction) { this._direction = direction; }
}
export default Movements;