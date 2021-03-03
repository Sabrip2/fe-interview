import React, { useState } from "react";
import { render } from "react-dom";

const CheckersBoard = ({ size }) => {
  const [board, setBoard] = useState([
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
  ]);

  const [xPrev, setX] = useState(-1);
  const [yPrev, setY] = useState(-1);
  const [curPlayer, setPlayer] = useState(1);
  const [redScore, setRed] = useState(0);
  const [whiteScore, setWhite] = useState(0);
  const [doubleJump, setJump] = useState(false);

  const spaceSize = size / 8;
  const pieceRadius = spaceSize / 2;

  const handleClickCircle = (row, column) => {
    let selected = board[column][row];
    // checks correct piece is selected
    if (selected > 2) {
      selected = Math.floor(selected / 2);
    }
    if (selected != curPlayer) {
      alert("It is not your turn to move");
      return;
    }
    // checks if in middle of double or tripple jump
    if (doubleJump && row != xPrev && column != yPrev) {
      alert("You must double jump");
      return;
    }
    setX(row);
    setY(column);
    hasMoves(column, row);
  };

  // moves piece at x1 y2 to x2 y2
  function move(x1, y1, x2, y2) {
    let copy = [...board];
    let temp = copy[y1][x1];
    copy[y1][x1] = 0;
    copy[y2][x2] = temp;
    setBoard(copy);
    checkKing(x2, y2);
    reset();
  }

  // resets values and switches current player
  function reset() {
    setX(-1);
    setY(-1);
    checkWin();
    setPlayer(curPlayer == 1 ? 2 : 1);
  }

  // checks if piece at x,y needs to be kinged
  function checkKing(x, y) {
    if (curPlayer == 1) {
      if (y == board.length - 1) {
        let copy = [...board];
        copy[y][x] = 3;
        setBoard(copy);
      }
    } else if (curPlayer == 2) {
      if (y == 0) {
        let copy = [...board];
        copy[y][x] = 4;
        setBoard(copy);
      }
    }
  }

  // preforms jump
  function jump(x1, y1, x2, y2) {
    let midy = (y1 + y2) / 2;
    let midx = (x1 + x2) / 2;
    let copy = [...board];
    let temp = copy[y1][x1];
    copy[y1][x1] = 0;
    copy[midy][midx] = 0;
    copy[y2][x2] = temp;
    checkKing(x2, y2);
    setBoard(copy);

    if (canJump(y2, x2)) {
      setX(x2);
      setY(y2);
      setJump(true);
    } else {
      setJump(false);
      reset();
    }
  }

  // checks for win state
  function checkWin() {
    var opponent = curPlayer == 1 ? 2 : 1;
    // check if captured all the pieces
    if (redScore == 12) {
      alert("Red Won");
    } else if (whiteScore == 12) {
      alert("White Won");
    } else {
      // Check if opponent has any moves
      for (var r = 0; r < board.length; r++) {
        for (var c = 0; c < board[0].length; c++) {
          if (
            (board[r][c] == opponent || board[r][c] == opponent + 2) &&
            hasMoves(r, c)
          ) {
            return true;
          }
        }
      }
      alert("Player " + curPlayer + " has won");
    }
  }

  // checks if piece is allowed to jump over other piece
  function canJumpOver(over, under) {
    if ((over == 1 || over == 3) && (under == 2 || under == 4)) {
      return true;
    } else if ((over == 2 || over == 4) && (under == 1 || under == 3)) {
      return true;
    }
    return false;
  }

  // returns true piece can jump
  function canJump(x, y) {
    // check pieces that can jump up (1,3,4)
    var selected = board[x][y];
    var under = 0;
    if (selected != 2 && x + 2 < board.length) {
      // check down left
      if (y - 2 >= 0 && board[x + 2][y - 2] == 0) {
        under = board[x + 1][y - 1];
        if (canJumpOver(selected, under)) {
          return true;
        }
      }
      // check down right
      if (y + 2 < board.length && board[x + 2][y + 2] == 0) {
        under = board[x + 1][y + 1];
        if (canJumpOver(selected, under)) {
          return true;
        }
      }
      // check pieces that can jump up (2,3,4)
    }
    if (selected != 1 && x - 2 >= 0) {
      // up right
      if (y + 2 < board.length && board[x - 2][y + 2] == 0) {
        under = board[x - 1][y + 1];
        if (canJumpOver(selected, under)) {
          return true;
        }
      }

      // up left
      if (y - 2 >= 0 && board[x - 2][y - 2] == 0) {
        under = board[x - 1][y - 1];
        if (canJumpOver(selected, under)) {
          return true;
        }
      }
    }
    return false;
  }

  // Checks if piece at x and y has a vaild move
  function hasMoves(x, y) {
    // checks any piece that can move up (1,3,4)
    if (
      board[x][y] != 2 &&
      x + 1 < board.length &&
      y - 1 >= 0 &&
      y + 1 < board.length
    ) {
      if (board[x + 1][y - 1] == 0 || board[x + 1][y + 1] == 0) {
        return true;
      }
    }
    // checks any piece that can move down (2,3,4)
    if (board[x][y] != 1 && y + 1 < board.length && y - 1 >= 0 && x - 1 >= 0) {
      if (board[x - 1][y + 1] == 0 || board[x - 1][y - 1] == 0) {
        return true;
      }
    }
    return canJump(x, y);
  }

  var handleClickSquare = (row, column) => {
    if (xPrev == -1 && yPrev == -1) {
      alert("Select a piece to move first");
      return;
    }
    if (board[column][row] != 0) {
      alert("This space is taken");
    } else {
      let selected = board[yPrev][xPrev];

      let yDis = column - yPrev;
      let xDis = Math.abs(row - xPrev);
      // checks if this is a valid 1 step move
      if (
        (selected != 2 && yDis == 1 && xDis == 1) ||
        (selected != 1 && yDis == -1 && xDis == 1)
      ) {
        move(xPrev, yPrev, row, column);
        // checks if this is a valid jump
      } else if (
        (selected != 2 && yDis == 2 && xDis == 2) ||
        (selected != 1 && yDis == -2 && xDis == 2)
      ) {
        let midy = (column + yPrev) / 2;
        let midx = (row + xPrev) / 2;
        if (canJumpOver(selected, board[midy][midx])) {
          // updates scores
          if (curPlayer == 1) {
            setWhite(whiteScore + 1);
          } else {
            setRed(redScore + 1);
          }
          jump(xPrev, yPrev, row, column);
        } else {
          alert("Invalid Move");
        }
      } else {
        alert("Invalid Move");
      }
    }
  };

  return (
    <div>
      <svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        {board.map((row, y) => {
          const isEvenRow = y % 2;
          const spaceY = spaceSize * y;

          return row.map((space, x) => {
            const isEvenSpace = x % 2;
            const spaceX = spaceSize * x;

            return (
              <Space
                key={x}
                shade={
                  (isEvenSpace && !isEvenRow) || (!isEvenSpace && isEvenRow)
                }
                size={spaceSize}
                x={spaceX}
                y={spaceY}
                click={() => handleClickSquare(x, y)}
              />
            );
          });
        })}
        {board.map((row, y) => {
          const spaceY = spaceSize * y;

          return row.map((space, x) => {
            const spaceX = spaceSize * x;

            if (space === 0) {
              // The space is empty.
              return null;
            }

            return (
              <Piece
                key={x}
                centerX={spaceX + pieceRadius}
                centerY={spaceY + pieceRadius}
                player={space}
                radius={pieceRadius * 0.75}
                click={() => handleClickCircle(x, y)}
              />
            );
          });
        })}
      </svg>
      <p>Current player is : {curPlayer} </p>
      <p>Player 1 score : {whiteScore} </p>
      <p>Player 2 score : {redScore} </p>
    </div>
  );
};

const Space = ({ shade, size, x, y, click }) => {
  return (
    <rect
      fill={shade ? "green" : "lightgray"}
      height={size}
      width={size}
      x={x}
      y={y}
      onClick={click}
    />
  );
};

const Piece = ({ centerX, centerY, player, radius, click }) => {
  var color = "white";
  if (player == 2) {
    color = "red";
  } else if (player == 3) {
    color = "Grey";
  } else if (player == 4) {
    color = "DarkRed";
  }
  return (
    <circle cx={centerX} cy={centerY} fill={color} r={radius} onClick={click} />
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
render(<CheckersBoard size={400} />, container);
