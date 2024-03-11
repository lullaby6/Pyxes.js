const Snake = {
    color: '#68c4af',
    tags: ['snake'],

    onLoad: current => {
        current.setSize(current.scene.grid, current.scene.grid)
    }
}

const Apple = {
    color: '#f44336',

    onLoad: current => {
        current.setSize(current.scene.grid, current.scene.grid)

        const x = randomIntFromInterval((current.scene.game.width/current.scene.grid)/2, (current.scene.game.width/current.scene.grid)-1)
        const y = randomIntFromInterval((current.scene.game.height/current.scene.grid)/2, (current.scene.game.height/current.scene.grid)-1)

        current.x =  x * current.scene.grid
        current.y = y * current.scene.grid
    },

    onPositionMatch: ({current, target}) => {
        const snakes = current.scene.getGameObjectsByTag('snake')
        const snakeHead = snakes[snakes.length - 1]

        if (target.id === snakeHead.id) {
            const newSnake = current.scene.instantGameObject(Snake)
            newSnake.x = target.x
            newSnake.y = target.y

            current.reset(current)

            current.scene.score++
        }
    },

    reset: current => {
        const x = randomIntFromInterval(0, (current.scene.game.width/current.scene.grid)-1)
        const y = randomIntFromInterval(0, (current.scene.game.height/current.scene.grid)-1)

        current.x =  x * current.scene.grid
        current.y = y * current.scene.grid

        const snakes = current.scene.getGameObjectsByTag('snake')
        snakes.forEach(snake => {
            if (positionsMatch(snake, current)) {
                current.reset(current)
            }
        })
    }
}

const MainScene = {
    grid: 50,
    speedX: 0,
    speedY: 0,
    score: 0,

    gameObjects: {
        apple: Apple,
        snake: Snake
    },

    onUpdate: current => {
        let snakes = current.getGameObjectsByTag('snake')

        const snakeHead = snakes[snakes.length-1]
        const newHead = current.instantGameObject(Snake)
        newHead.x = snakeHead.x + current.speedX
        newHead.y = snakeHead.y + current.speedY

        current.removeGameObject(snakes[0].name)

        if (snakes.length > 1) {
            snakes.forEach(snake => {
                if (newHead.id !== snake.id && newHead.x === snake.x && newHead.y === snake.y){
                    current.game.resetScene()
                }
            })
        }

        if (newHead.x > current.game.width-current.grid ||
            newHead.x < 0 ||
            newHead.y > current.game.height-current.grid ||
            newHead.y < 0
        ) {
            current.game.resetScene()
        }
    },

    onKeydown: ({event, current}) => {
        const snakes = current.getGameObjectsByTag('snake')

        if(event.key == 'd' || event.key == 'ArrowRight') {
            current.speedY = 0
            if (snakes.length > 1) {
                if (current.speedX !== -current.grid) current.speedX = current.grid
            } else current.speedX = current.grid
        } else if (event.key == 'a' || event.key == 'ArrowLeft') {
            current.speedY = 0
            if (snakes.length > 1) {
                if (current.speedX !== current.grid) current.speedX = -current.grid
            } else current.speedX = -current.grid
        } else if (event.key == 'w' || event.key == 'ArrowUp') {
            current.speedX = 0
            if (snakes.length > 1) {
                if (current.speedY !== current.grid) current.speedY = -current.grid
            } else current.speedY = -current.grid
        } else if (event.key == 's' || event.key == 'ArrowDown') {
            current.speedX = 0
            if (snakes.length > 1) {
                if (current.speedY !== -current.grid) current.speedY = current.grid
            } else current.speedY = current.grid
        }
    },
}

const game = new Game({
    backgroundColor: '#FBFAFA',
    fps: 6,
    cursor: false,
    title: 'Snake - Pyxes',

    scenes: {
        main: MainScene
    },

    onKeydown: ({event, current}) => {
        if (event.key == 'p') current.togglePause()
        else if (event.key == 'r') current.resetScene()
        else if (event.key == 'f') current.toggleFullscreen()
    },

    onPause: current => {
        current.setCursorVisibility(true)
    },
    onResume: current => {
        current.setCursorVisibility(false)
    }
})

game.run()