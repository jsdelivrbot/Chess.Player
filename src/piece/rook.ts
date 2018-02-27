import {Vector} from "../vector"
import {Radius} from "../radius"
import {Piece} from "../piece"

export class Rook extends Piece {
    name: string = "Rook";
    radius = new Radius();
    home: [number, number][] =
        [[0, 3], [0, 10]];

    moves(): [Vector, boolean][] {
        return [];
    }

    attacks(): [Vector, boolean][] {
        return [[new Vector(r =>  r, _ =>  0), true],
                [new Vector(r => -r, _ =>  0), true],
                [new Vector(_ =>  0, r =>  r), true],
                [new Vector(_ =>  0, r => -r), true]];
    }
}
