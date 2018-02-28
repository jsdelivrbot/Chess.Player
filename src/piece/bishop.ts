import {Vector} from "../vector"
import {Radius} from "../radius"
import {Piece} from "../piece"

export class Bishop extends Piece {
    radius = new Radius();
    name: string = "Bishop";
    home: [number, number][] =
        [[0, 5], [0, 8]];

    moves(): [Vector, boolean][] {
        return [];
    }

    attacks(): [Vector, boolean][] {
        return [[new Vector(r =>  r, r =>  r), true],
                [new Vector(r =>  r, r => -r), true],
                [new Vector(r => -r, r =>  r), true],
                [new Vector(r => -r, r => -r), true]];
    }
}
