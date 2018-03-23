import {Knight} from "./piece/knight"
import {Bishop} from "./piece/bishop"
import {Queen} from "./piece/queen"
import {King} from "./piece/king"
import {Rook} from "./piece/rook"
import {Pawn} from "./piece/pawn"
import {Piece} from "./piece"
import {Board} from "./board"

export class Square {
    m: number;
    n: number;
    code: string;
    piece: Piece;
    board: Board;
    valid: boolean;
    element: HTMLDivElement;

    hasPiece(): boolean {
        return this.piece !== null && this.piece !== undefined;
    }

    createPiece(): Piece {
        return [].slice
            .call(this.element.children)
            .filter(e => e instanceof HTMLElement &&
                         e.className.indexOf("piece-") === 0)
            .map(e => e.attributes["data-piece"])
            .filter(a => a !== null && a !== undefined)
            .map(a => a.value)
            .map(c => {
                switch (c.charAt(1)) {
                    case "R":
                        return new Rook(c, this);
                    case "P":
                        return new Pawn(c, this);
                    case "K":
                        return new King(c, this);
                    case "Q":
                    case "D":
                        return new Queen(c, this);
                    case "B":
                        return new Bishop(c, this);
                    case "N":
                        return new Knight(c, this);
                }
            })[0];
    }

    isEnclosed(): boolean {
        return this.board.squares
            .filter(s => Math.abs(this.m - s.m) === 1 &&
                         Math.abs(this.n - s.n) === 1)
            .every(s => s.hasPiece());
    }

    isCovered(): boolean {
        return this.board.squares
            .filter(s => s.hasPiece())
            .map(s => s.piece)
            .filter(p => p.player.playing())
            .some(p => p.candidates.attacks.some(s => s === this));
    }

    constructor(board: Board, element: Element) {
        this.board = board;
        if (element instanceof HTMLDivElement) {
            this.element = element;
            const ds = element.attributes["data-square"];
            if (ds) {
                this.code = ds.value;
                this.m = parseInt(this.code.slice(1)) - 1;
                this.n = this.code.charCodeAt(0) - 97;
                this.piece = this.createPiece();
                this.valid = [].slice
                    .call(element.classList)
                    .every(c => c.indexOf("blank-") === -1);
            }
        }
    }
}
