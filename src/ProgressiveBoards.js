import React from 'react'

const generateBoard = (size) => {
  const board = []
  const rows = 'ABCDEFGHI'.slice(0, size)
  const cols = Array.from({ length: size }, (_, i) => i + 1)

  for (let row of rows) {
    const boardRow = []
    for (let col of cols) {
      boardRow.push(`${row}${col}`)
    }
    board.push(boardRow)
  }
  return board
}

const ProgressiveBoards = () => {
  const grid = []
  for (let i = 0; i < 3; i++) {
    const boards = []
    for (let j = 1; j <= 3; j++) {
      boards.push(generateBoard(i * 3 + j))
    }
    grid.push(boards)
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {grid.map((boards, index) => {
        // const gridSize = Math.ceil(Math.sqrt(board.length))
        return (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center"
            style={{
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'space-around',
              }}
          >
            {boards.map((board, i) => {
              return (
                <div>
                  <h3 className="text-lg font-bold text-center mb-4">
                    Board {index + 1}
                  </h3>
                  <div
                    className="grid gap-1 border border-black"
                    //   style={{
                    //     gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    //     width: '100%',
                    //     aspectRatio: '1 / 1',
                    //   }}
                  >
                    {board.map((boardRow, i) => (
                      <div
                        key={`boardRow${i}`}
                        className="flex items-center justify-center border border-black text-black font-medium"
                        style={{
                          flexDirection: 'row',
                          display: 'flex',
                          justifyContent: 'space-around',
                        }}
                      >
                        {boardRow.map((cell, j) => (
                          <div
                            key={`cell${j}`}
                            className="flex items-center justify-center w-full h-full"
                          >
                            {cell}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default ProgressiveBoards
