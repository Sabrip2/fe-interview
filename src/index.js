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

  const spaceSize = size / 8;
  const pieceRadius = spaceSize / 2;

  return (
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
              shade={(isEvenSpace && !isEvenRow) || (!isEvenSpace && isEvenRow)}
              size={spaceSize}
              x={spaceX}
              y={spaceY}
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
            />
          );
        });
      })}
    </svg>
  );
};

const Space = ({ shade, size, x, y }) => {
  return (
    <rect
      fill={shade ? "green" : "lightgray"}
      height={size}
      width={size}
      x={x}
      y={y}
    />
  );
};

const Piece = ({ centerX, centerY, player, radius }) => {
  return (
    <circle
      cx={centerX}
      cy={centerY}
      fill={player === 1 ? "white" : "red"}
      r={radius}
    />
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
render(<CheckersBoard size={400} />, container);
