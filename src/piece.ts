import {Yellow} from "./player/yellow"
import {Green} from "./player/green"
import {Blue} from "./player/blue"
import {Dead} from "./player/dead"
import {Red} from "./player/red"
import {Player} from "./player"
import {Square} from "./square"
import {Vector} from "./vector"

export abstract class Piece {
    candidates: ({
        attacks: Square[],
        moves: Square[]
    });
    square: Square;
    player: Player;
    code: string;
    max: number;

    abstract name: string;
    abstract home: [number, number][];
    abstract attacks(): Vector[];
    abstract moves(): Vector[];

    moved(): boolean { // TODO: this will not work because now we can't set m1 and n1 - fix it
        let moved = true;
        for (let i = 0; i < this.home.length; i++) {
            const m1 = this.home[i][0] - 6.5;
            const n1 = this.home[i][1] - 6.5;
            const [x2, y2] = this.player.rotate(new Vector(r => r + 6.5, r => r + 6.5), -6.5);
            if (this.square.n === x2 &&
                this.square.m === y2) {
                moved = false;
                break;
            }
        }
        return moved;
    }

    createPlayer(code: string): Player {
        switch (code.charAt(0)) {
            case "w":
                return new Red(this);
            case "g":
                return new Blue(this);
            case "b":
                return new Yellow(this);
            case "r":
                return new Green(this);
            case "d":
                return new Dead(this);
            default:
                return undefined;
        }
    }
    
    move(vector: Vector, radius: number, square: Square): void {
        if (!square.piece) {
            this.candidates.moves.push(square);
            this.scale(vector, radius + 1, this.move);
        }
    }

    attack(vector: Vector, radius: number, square: Square): void {
        this.candidates.attacks.push(square);
        if (!square.piece) {
            this.scale(vector, radius + 1, this.attack);
        }
    }

    scale(vector: Vector, radius: number, traverse: (vector: Vector, radius: number, square: Square) => void): void {
        if (!this.max || radius <= this.max) {
            const [x2, y2] = this.player.rotate(vector, radius);
            this.square.board.squares
                .filter(s => s.n === x2 && s.m === y2)
                .forEach(s => traverse(vector, radius, s));
        }
    }

    createCandidates(): void {
        this.moves().forEach(v => this.scale(v, 1, this.move))
        this.attacks().forEach(v => this.scale(v, 1, this.attack));
    }

    colouriseCandidates(): void {
        if (this.candidates.moves.length > 0) {
            this.candidates.moves.forEach(s => {
                this.colouriseMovementSquares(s);
            });
        } else {
            this.candidates.attacks.forEach(s => {
                this.colouriseMovementSquares(s);
            });
        }
    }

    colouriseMovementSquares(square: Square): void {
        const candidates =
            this.square.board.squares
                .filter(s => s.hasPiece())
                .map(s => s.piece)
                .filter(p => p !== this)
                .filter(p => p.candidates.attacks.some(s => s === this.square));

        const allies = candidates.filter(p => p.player.playing());

        square.element.classList.add("cp-mod");
        square.element.style.backgroundColor =
            this.square.board.colourHelper.getColour(square.element,
                (allies.length >= (candidates.length - allies.length)));
    }

    colouriseAttackerSquares(): void {
        this.square.board.squares
            .filter(s => s.hasPiece())
            .map(s => s.piece)
            .filter(p => !p.player.playing())
            .filter(p => p.candidates.attacks.some(s => s === this.square))
            .map(p => p.square)
            .forEach(s => {
                s.element.classList.add("cp-mod");
                s.element.style.backgroundColor =
                    this.square.board.colourHelper.getColour(s.element, false);
            });
    }

    constructor(code: string, square: Square) {
        this.player = this.createPlayer(code);
        this.square = square;
        this.code = code;
    }
}
