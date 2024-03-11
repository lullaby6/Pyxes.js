const MainScene = {
    cellSize: 5,
    rows: 100,
    columns: 200,

    onLoad: current => {
        current.boardNeighbors = Array(current.rows).fill().map(() => Array(current.columns).fill(0))
        current.board = Array(current.rows).fill().map(() => Array(current.columns).fill(0))

        current.board.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (randomItemFromArray([0, 1]) == 1){  
                    current.board[rowIndex][colIndex] = 1
                }
            })
        })

        current.game.setSize(current.columns * current.cellSize, current.rows * current.cellSize)
        current.game.camera.setPosition(current.game.width/2, current.game.height/2)
    },

    onUpdate: current => {
        current.board.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                let neighbors = 0
                
                new Array(-1, 0, 1).forEach(dr => {
                    new Array(-1, 0, 1).forEach(dc => {
                        const r = rowIndex + dr
                        const c = colIndex + dc

                        if (
                            !(dr == 0 && dc == 0) &&
                            (rowIndex != dr && colIndex != dc) &&
                            r >= 0 && 
                            r < current.rows && 
                            c >= 0 && 
                            c < current.columns && 
                            current.board[r][c] == 1
                        ) {
                            neighbors += 1
                        }
                    })
                })

                current.boardNeighbors[rowIndex][colIndex] = neighbors
            })
        })

        current.board.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (current.board[rowIndex][colIndex] == 1) {
                    if (current.boardNeighbors[rowIndex][colIndex] < 2 || current.boardNeighbors[rowIndex][colIndex] > 3){
                        current.board[rowIndex][colIndex] = 0
                    }
                } else if (current.boardNeighbors[rowIndex][colIndex] == 3) {
                    current.board[rowIndex][colIndex] = 1
                }
            })
        })
    },

    onRender: current => {
        current.board.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (current.board[rowIndex][colIndex] == 1) {
                    current.game.ctx.fillStyle = "#fff"

                    current.game.ctx.fillRect(colIndex * current.cellSize, rowIndex * current.cellSize, current.cellSize, current.cellSize)
                }
            })
        })
    }
}

const game = new Game({
    backgroundColor: '#111',
    fps: 8,
    cursor: false,
    title: 'Game of Life - Pyxes',

    scenes: {
        main: MainScene
    },

    onKeydown: ({event, current}) => {
        if (event.key == 'p') current.togglePause()
        if (event.key == 'r') current.resetScene()
        if (event.key == 'f') current.setFullscreen(!current.fullScreen)
    },

    onPause: current => {
        current.setCursorVisibility(true)
    },
    onResume: current => {
        current.setCursorVisibility(false)
    }
})

game.run()