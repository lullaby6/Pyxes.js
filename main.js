const mainScene = {
    cellSize: 50,
    size: 10,

    onLoad: current => {
        current.rowsCount = current.size
        current.columnsCount = current.size

        current.boardBase = Array(current.rowsCount).fill().map(() => Array(current.columnsCount).fill(0))

        current.boardNeighbors = structuredClone(current.boardBase)
        current.board = structuredClone(current.boardBase)

        current.board.forEach((row, rowI) => {
            row.forEach((col, colI) => {
                if (randomItemFromArray([0, 1]) == 1){
                    current.board[rowI][colI] = 1
                }
            })
        })

        current.game.setSize(current.columnsCount * current.cellSize, current.rowsCount * current.cellSize)
    },

    onUpdate: current => {
        current.board.forEach((row, rowI) => {
            row.forEach((col, colI) => {
                let neighbors = 0
                
                new Array(-1, 0, 1).forEach(dr => {
                    new Array(-1, 0, 1).forEach(dc => {
                        const r = rowI + dr
                        const c = colI + dc

                        if (
                            !(r == 0 && c == 0) &&
                            r >= 0 && 
                            r < current.rowsCount-1 && 
                            c >= 0 && 
                            c < current.columnsCount && 
                            current.board[r][c] == 1
                        ) neighbors += 1
                    })
                })

                current.boardNeighbors[rowI][colI] = neighbors
            })
        })

        current.board.forEach((row, rowI) => {
            row.forEach((col, colI) => {
                if (current.board[rowI][colI] == 1) {
                    if (current.boardNeighbors[rowI][colI] < 2 || current.boardNeighbors[rowI][colI] > 3){
                        current.board[rowI][colI] = 0
                    }
                } else if (current.boardNeighbors[rowI][colI] == 3) {
                    current.board[rowI][colI] = 1
                }
            })
        })
        
        current.board.forEach((row, rowI) => {
            row.forEach((col, colI) => {
                if (current.board[rowI][colI] == 1) {
                    current.game.ctx.fillStyle = "#fff"

                    current.game.ctx.fillRect(colI * current.cellSize, rowI * current.cellSize, current.cellSize, current.cellSize)
                }
            })
        })
    },
}

const game = new Game({
    backgroundColor: '#000',
    fps: 5,
    cursor: false,
    title: 'Game of Life - Pyxes',
    scenes: {
        main: mainScene
    },
    onKeydown: ({event, current}) => {
        // if(event.key == 'p') current.togglePause()
        if(event.key == 'r') current.resetScene()
        if(event.key == 'f') current.setFullscreen(!current.fullScreen)
    },
})

game.run()