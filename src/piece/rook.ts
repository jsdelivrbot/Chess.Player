import {Vector} from "../vector"
import {Piece} from "../piece"

export class Rook extends Piece {
    value = 5;
    name = "Rook";
    home: [number, number][] =
        [[3, 0], [10, 0]];

    moves(): Vector[] {
        return [];
    }

    attacks(): Vector[] {
        return [new Vector(r =>  r, _ =>  0),
                new Vector(r => -r, _ =>  0),
                new Vector(_ =>  0, r =>  r),
                new Vector(_ =>  0, r => -r)];
    }
}
