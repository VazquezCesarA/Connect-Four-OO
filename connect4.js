/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(WIDTH, HEIGHT, colorP1, colorP2) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.currPlayer = 1;
    this.player1 = new Player(colorP1);
    this.player2 = new Player(colorP2);
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
  }
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  makeHtmlBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    if (this.currPlayer == 1)
      piece.style.backgroundColor = this.player1.colorName;
    else piece.style.backgroundColor = this.player2.colorName;

    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    alert(msg);
  }
  checkForWin() {
    const top = document.getElementById("column-top");
    function _win(cells, w, h, b, c) {
      return cells.every(
        ([y, x]) => y >= 0 && y < h && x >= 0 && x < w && b[x][y] === c
      );
    }
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];
        if (
          _win(horiz, this.HEIGHT, this.WIDTH, this.board, this.currPlayer) ||
          _win(vert, this.HEIGHT, this.WIDTH, this.board, this.currPlayer) ||
          _win(diagDR, this.HEIGHT, this.WIDTH, this.board, this.currPlayer) ||
          _win(diagDL, this.HEIGHT, this.WIDTH, this.board, this.currPlayer)
        ) {
          console.log((top.innerHTML = ""));
          return true;
        }
      }
    }
  }
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win

    if (this.checkForWin.call(this)) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }
}

class Player {
  constructor(colorName) {
    this.colorName = colorName;
  }
}

new Game(
  7,
  6,
  document.getElementById("colorP1").value,
  document.getElementById("colorP2").value
);

const startBtn = document.getElementById("startButton");
startBtn.addEventListener("click", function () {
  new Game(
    7,
    6,
    document.getElementById("colorP1").value,
    document.getElementById("colorP2").value
  );
});

