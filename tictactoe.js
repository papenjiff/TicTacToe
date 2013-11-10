/**
 * Tic Tac Toe
 *
 *  Each turn:
 *   - generate possible next moves
 *   - for each move, calculate score for move
 *   - select move with maximum possible gain
 */

var TicTacToe = function() {
    /**
     * | 2 | 4 | 8 |
     * -------------
     * | 16| 32| 64|
     * -------------
     * |128|256|512|
     */
    this.ai = 1;
    this.player = 2;
    this.maxPlayer = this.ai;
    this.minPlayer = this.player;

    this.firstPlayer = this.player;

    this.rows = 3;
    this.columns = 3;

    this.boxes = [[2   ,4   ,8],
                  [16  ,32  ,64],
                  [128 ,256 ,512]];

    this.board = [[0,0,0],
                  [0,0,0],
                  [0,0,0]];

    this.lines = [[[0,0], [0,1], [0,2]],
                  [[1,0], [1,1], [1,2]],
                  [[2,0], [2,1], [2,2]],
                  [[0,0], [1,0], [2,0]],
                  [[0,1], [1,1], [2,1]],
                  [[0,2], [1,2], [2,2]],
                  [[0,0], [1,1], [2,2]],
                  [[0,2], [1,1], [2,0]]];

    this.winners = [2+4+8,    16+32+64, 128+256+512,  // horizontal
                    2+16+128, 4+32+256, 8+64+512,     // vertical
                    2+32+512, 8+32+128];              // diagonal

    this.marks = {1: '[X]', 2: '[O]'}

    this.$board = null;

    this.audio = null;

    this.init = function() {
        var gameBoard = this;

        this.$board = $('div.board');

        $('span.box').on('click', function () {

            var $box = $(this);

            if (gameBoard.playerMove($box.data('row'), $box.data('column'))) {

                $box.html(gameBoard.marks[gameBoard.player]);

                gameBoard.aiMove();

                if (gameBoard.isWinner(gameBoard.player)) {
                    alert('You win!');
                    gameBoard.reset();
                } else if (gameBoard.isWinner(gameBoard.ai)) {
                    alert('I win.. no surprise. Better luck next time.');
                    gameBoard.reset();
                } else if (gameBoard.getPossibleMoves().length == 0) {
                    gameBoard.playSoundEffect('not2play');
                    alert('A strange game. The only winning move is not to play.');
                    gameBoard.reset();
                }
            }
        });

        $('#new').on('click', function(e) {
            gameBoard.firstPlayer = parseInt($('#first').val());
            gameBoard.reset();
            e.preventDefault();
        });

        this.audio = {'not2play': $('#game_audio_not2play')[0]}

        setTimeout(function() {
            gameBoard.$board.fadeIn();
        }, 1500);
    };

    this.reset = function() {
        for (var r=0; r < this.rows; r++) {
            for (var c=0; c< this.columns; c++) {
                this.board[r][c] = 0;
            }
        }

        $('.box').each(function() {
            var $box = $(this);
            $box.html('[&nbsp;]');
        });

        if (this.firstPlayer == this.ai) {
            this.aiMove();
        }

    };

    this.playerMove = function(row, column) {
        if (this.board[row][column] == 0) {
            this.board[row][column] = this.player;
            return true;
        } else {
            return false;
        }
    };

    this.aiMove = function(player) {
        if (player == undefined) player = this.ai;

        if (player == this.player) {
            this.maxPlayer = this.player;
            this.minPlayer = this.ai;
        } else {
            this.maxPlayer = this.ai;
            this.minPlayer = this.player;
        }

        var bestMove = this.getBestMove(player, 2);

        if (bestMove[1] != null) {
            var $box = $('#box-' + bestMove[1] + '-' + bestMove[2]);
            $box.html(this.marks[player]);

            this.board[bestMove[1]][bestMove[2]] = player;
            return true;
        }
        return false;
    };

    this.getBestMove = function (player, depth) {
        var bestRow = null;
        var bestColumn = null;
        var currentScore = null;
        var bestScore = (player == this.maxPlayer) ? -100000 : 100000;

        var possibleMoves = this.getPossibleMoves();

        if (possibleMoves.length == this.rows * this.columns) {
            return this.randomMove();
        } else if (possibleMoves.length == 0 || depth == 0) {
            bestScore = this.getScore();
        } else {
            for(var m=0; m < possibleMoves.length; m++) {
                this.board[possibleMoves[m][0]][possibleMoves[m][1]] = player;
                if (player == this.maxPlayer) {
                    currentScore = this.getBestMove(this.minPlayer, depth - 1)[0];
                    if (currentScore > bestScore) {
                        bestScore = currentScore;
                        bestRow = possibleMoves[m][0];
                        bestColumn = possibleMoves[m][1];
                    }
                 } else {
                    currentScore = this.getBestMove(this.maxPlayer, depth - 1)[0];
                    if (currentScore < bestScore) {
                        bestScore = currentScore;
                        bestRow = possibleMoves[m][0];
                        bestColumn = possibleMoves[m][1];
                    }
                }
                this.board[possibleMoves[m][0]][possibleMoves[m][1]] = 0;
            }
        }
        return [bestScore, bestRow, bestColumn];
    };

    /**
     * +100/-100 for 3 in a row, +10/-10 for 2 in a row, +1/-1 for 1 in a row
     */
    this.getScore = function() {
        var score = 0;

        for (var l=0; l < this.lines.length; l++) {
            var emptyCount = 0;
            var minCount = 0;
            var maxCount = 0;
            for (var b = 0; b < this.rows; b++) {
                var row = this.lines[l][b][0];
                var column = this.lines[l][b][1];
                var box = this.board[row][column];

                if (box == this.minPlayer) {
                    minCount++;
                } else if (box == this.maxPlayer) {
                    maxCount++;
                } else {
                    emptyCount++;
                }
            }

            if (minCount == 3) {
                score -= 100;
            }
            if (minCount == 2 && emptyCount == 1) {
                score -= 10;
            }
            if (minCount == 1 && emptyCount == 2) {
               score -= 1;
            }
            if (maxCount == 3) {
                score += 100;
            }
            if (maxCount == 2 && emptyCount == 1) {
                score += 10;
            }
            if (maxCount == 1 && emptyCount == 2) {
                score += 1;
            }

        }
        return score;
    };

    this.getPossibleMoves = function() {
        var possibleMoves = [];
        if (this.isWinner(this.player) || this.isWinner(this.ai)) return possibleMoves;

        for (var r=0; r < this.rows; r++) {
            for (var c=0; c < this.columns; c++) {
                if (this.board[r][c] == 0) {
                    possibleMoves.push([r,c]);
                }
            }
        }

        return possibleMoves;
    };

    this.randomMove = function() {
        var row = Math.floor(Math.random() * this.rows);
        var column = Math.floor(Math.random() * this.columns);

        return [0, row, column];
    }

    this.isWinner = function (player) {
        var playerPattern = 0;
        for (var r=0; r < this.rows; r++) {
            for (var c=0; c< this.columns; c++) {
                if (this.board[r][c] == player) {
                    playerPattern += this.boxes[r][c];
                }
            }
        }

        for (var i=0; i < this.winners.length; i++) {
            if ((playerPattern & this.winners[i]) == this.winners[i]) {
                return true;
            }
        }
    };

    this.playSoundEffect = function(effect) {
        if (this.audio[effect] != undefined) {
            this.audio[effect].play();
        }
    }
};

