import { makeAutoObservable } from "mobx";
import Movement from "./Movements";

class MovementsStore {


    // Attributs
    _movements;

    // Constructeur
    constructor() {
        this._movements = [];

        makeAutoObservable(this);
        this.loadArticles();
    }

    // Accesseur en lecture
    get movements() {
        return this._movements;
    }

    // Accesseur en écriture
    set movements(movements) {
        this._movements = movements;
    }

    // Méthodes

    async loadArticles() {
        try {
            // Charger le fichier JSON
            const response = await fetch("../PWA/movements.json");
            const data = await response.json();

            // Transformer les données en objets movement et les stocker dans this._articles
            this._movements = data.map(movement => new Movement(
                movement.id,
                movement.description,
                movement.image,
                movement.threshold,
                movement.timer,
                movement.point_per_moves,
                movement.repeat,
                movement.type,
                movement.orientation,
                movement.direction,
            ));

            console.log(this._movements);

        } catch (error) {
            console.error("Erreur lors du chargement des mouvements :", error);
        }
    }

    setNewMovements(tab){
        this.movements = tab;
    }

    getMovementById(id) {
        return this._movements.find(movement => movement.id == id);
    }
}

export default MovementsStore;