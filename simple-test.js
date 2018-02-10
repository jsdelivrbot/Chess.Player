var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Change;
(function (Change) {
    Change[Change["Added"] = 0] = "Added";
    Change[Change["Removed"] = 1] = "Removed";
    Change[Change["Captured"] = 2] = "Captured";
    Change[Change["Died"] = 3] = "Died";
})(Change || (Change = {}));
var Player = (function () {
    function Player(dp) {
        this.map = {
            "b": "Yellow",
            "r": "Green",
            "g": "Blue",
            "d": "Dead",
            "w": "Red"
        };
        this.name = this.map[dp.charAt(0)];
    }
    return Player;
}());
var Piece = (function () {
    function Piece(dp) {
        this.map = {
            "R": "Rook",
            "P": "Pawn",
            "K": "King",
            "Q": "Queen",
            "B": "Bishop",
            "N": "Knight"
        };
        this.name = this.map[dp.charAt(1)];
        this.player = new Player(dp);
        this.dp = dp;
    }
    return Piece;
}());
var Square = (function () {
    function Square(m, n) {
        this.code = this.convert(m, n);
        this.m = m;
        this.n = n;
    }
    Square.prototype.convert = function (m, n) {
        return "" + String.fromCharCode(n + 97) + (m + 1);
    };
    return Square;
}());
var Board = (function () {
    function Board() {
        this.squares = [];
        for (var m = 0; m < 14; m++) {
            this.squares[m] = [];
            for (var n = 0; n < 14; n++) {
                this.squares[m][n] = new Square(m, n);
            }
        }
    }
    return Board;
}());
var Turn = (function () {
    function Turn(datetime) {
        this.datetime = datetime;
        this.board = new Board();
    }
    return Turn;
}());
var Variance = (function (_super) {
    __extends(Variance, _super);
    function Variance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.additions = 0;
        _this.captures = 0;
        _this.removals = 0;
        _this.deaths = 0;
        return _this;
    }
    return Variance;
}(Turn));
var Factory = (function () {
    function Factory() {
        this.turns = [];
        this.variances = [];
        this.corrections = [];
    }
    Factory.prototype.turn = function (datetime) {
        for (var _i = 0, _a = this.turns; _i < _a.length; _i++) {
            var turn = _a[_i];
            if (turn.datetime === datetime) {
                return turn;
            }
        }
        return null;
    };
    Factory.prototype.variance = function (datetime) {
        for (var _i = 0, _a = this.variances; _i < _a.length; _i++) {
            var variance = _a[_i];
            if (variance.datetime === datetime) {
                return variance;
            }
        }
        return null;
    };
    Factory.prototype.map = function (change) {
        switch (change) {
            case Change.Added:
                return "+";
            case Change.Removed:
                return "-";
            case Change.Captured:
                return "*";
            case Change.Died:
                return "x";
            default:
                return " ";
        }
    };
    Factory.prototype.process = function (changes) {
        for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
            var change = changes_1[_i];
            if (change.mutation.type === "childList" &&
                change.mutation.target.attributes["data-square"]) {
                var turn = this.turn(change.datetime);
                if (turn == null) {
                    turn = new Turn(change.datetime);
                    this.turns.push(turn);
                }
                var code = change.mutation.target.attributes["data-square"].value;
                if (change.mutation.addedNodes.length === 1) {
                    var dpa = change.mutation.addedNodes[0].attributes["data-piece"].value;
                    for (var m = 0; m < 14; m++) {
                        for (var n = 0; n < 14; n++) {
                            if (turn.board.squares[m][n].code === code) {
                                turn.board.squares[m][n].piece = new Piece(dpa);
                            }
                        }
                    }
                }
            }
        }
        return this;
    };
    Factory.prototype.analyse = function () {
        if (this.turns.length > 1) {
            for (var i = 1; i < this.turns.length; i++) {
                var variance = new Variance(this.turns[i].datetime);
                for (var m = 0; m < 14; m++) {
                    for (var n = 0; n < 14; n++) {
                        var to = this.turns[i].board.squares[m][n];
                        var from = this.turns[i - 1].board.squares[m][n];
                        if (from.piece === undefined && to.piece !== undefined) {
                            variance.board.squares[m][n].piece = to.piece;
                            variance.board.squares[m][n].change = Change.Added;
                            variance.additions++;
                        }
                        if (from.piece !== undefined && to.piece === undefined) {
                            variance.board.squares[m][n].piece = from.piece;
                            variance.board.squares[m][n].change = Change.Removed;
                            variance.removals++;
                        }
                        if (from.piece !== undefined && to.piece !== undefined) {
                            if (from.piece.dp !== to.piece.dp) {
                                variance.board.squares[m][n].piece = to.piece;
                                if (to.piece.player.name === "Dead") {
                                    variance.board.squares[m][n].change = Change.Died;
                                    variance.deaths++;
                                }
                                else {
                                    variance.board.squares[m][n].change = Change.Captured;
                                    variance.captures++;
                                }
                            }
                        }
                    }
                }
                this.variances.push(variance);
            }
        }
        return this;
    };
    Factory.prototype.correct = function () {
        for (var m = 0; m < 14; m++) {
            for (var n = 0; n < 14; n++) {
            }
        }
        return this;
    };
    Factory.prototype.apply = function () {
        return this;
    };
    Factory.prototype.header = function (turn, variance) {
        return "When: " +
            turn.datetime +
            "                         " +
            "Additions: " +
            variance.additions +
            "     " +
            "Removals: " +
            variance.removals +
            "     " +
            "Captures: " +
            variance.captures +
            "     " +
            "Deaths: " +
            variance.deaths;
    };
    Factory.prototype.show = function (turns) {
        for (var i = 1; i < Math.min(this.turns.length, turns); i++) {
            var turn = this.turns[i];
            var variance = this.variance(turn.datetime);
            console.log(this.header(turn, variance));
            for (var m = 0; m < 14; m++) {
                var line = "[ ";
                for (var n = 0; n < 14; n++) {
                    var square = turn.board.squares[m][n];
                    if (square.piece === undefined) {
                        line += "[]";
                    }
                    else {
                        line += square.piece.dp;
                    }
                    line += " ";
                }
                line += "]  |  [ ";
                for (var n = 0; n < 14; n++) {
                    var square = variance.board.squares[m][n];
                    if (square.piece === undefined) {
                        line += "[ ]";
                    }
                    else {
                        line += square.piece.dp;
                        line += this.map(square.change);
                    }
                    line += " ";
                }
                line += "]";
                console.log(line);
            }
            console.log("");
        }
        return this;
    };
    return Factory;
}());
