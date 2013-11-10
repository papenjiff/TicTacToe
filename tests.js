/**
 * QUnit Tests for TicTacToe
 */

var TestHelpers  = {
    checkWinningMoves: function (moves) {
        var gameBoard = new TicTacToe();
        for (var x=0; x < moves.length; x++) {
            gameBoard.playerMove(moves[x][0], moves[x][1]);
        }
        return gameBoard.isWinner(gameBoard.player);
    }
};

module("TicTacToe Tests");

test("diagonal line results in a win", function() {
    var gameBoard = new TicTacToe();
    gameBoard.playerMove(0, 0);
    gameBoard.playerMove(1, 1);
    gameBoard.playerMove(2, 2);
    ok(gameBoard.isWinner(gameBoard.player));
});

test("incomplete line does not result in a win", function() {
    var gameBoard = new TicTacToe();
    gameBoard.playerMove(1, 1);
    gameBoard.playerMove(2, 2);
    ok(!gameBoard.isWinner(gameBoard.player));
});

test("Winning patterns match correctly.", function() {
    ok(TestHelpers.checkWinningMoves([[0,0],[0,1],[0,2]]));
    ok(TestHelpers.checkWinningMoves([[1,0],[1,1],[1,2]]));
    ok(TestHelpers.checkWinningMoves([[2,0],[2,1],[2,2]]));
    ok(TestHelpers.checkWinningMoves([[0,0],[1,0],[2,0]]));
    ok(TestHelpers.checkWinningMoves([[0,1],[1,1],[2,1]]));
    ok(TestHelpers.checkWinningMoves([[0,2],[1,2],[2,2]]));
    ok(TestHelpers.checkWinningMoves([[0,0],[1,1],[2,2]]));
    ok(TestHelpers.checkWinningMoves([[0,2],[1,1],[2,0]]));
});

test("Play 100 rounds with no wins", function () {
    var playerWin;
    var aiWin;
    for (var x=0; x<100; x++) {
        var gameBoard = new TicTacToe();
        do {
            gameBoard.aiMove(gameBoard.ai);
            gameBoard.aiMove(gameBoard.player);
        } while (gameBoard.getPossibleMoves().length > 0);
        playerWin = gameBoard.isWinner(gameBoard.ai);
        aiWin = gameBoard.isWinner(gameBoard.player);
        ok(!playerWin && !aiWin);
    }

});

