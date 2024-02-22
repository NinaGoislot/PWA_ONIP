import MovementsStore from "./MovementsStore";
import PartieStore from "./PartieStore";

export const store = {
    movementsStore: new MovementsStore(),
    partieStore: new PartieStore(),
};
