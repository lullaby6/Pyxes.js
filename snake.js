const Snake = {
    color: '#68c4af',
    tags: ['snake'],
    onLoad: current => {
        current.setSize(current.scene.grid, current.scene.grid)
    },
    onUpdate: current => {
        // current.scene.game.camera.setTarget(current.x, current.y)
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
        const snake = current.scene.getGameObjectsByTag('snake')
        const snakeHead = snake[snake.length - 1]

        if(target.id === snakeHead.id){
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

        const snake = current.scene.getGameObjectsByTag('snake')
        snake.forEach(snake => {
            if (positionsMatch(snake, current)){
                current.reset(current)
            }
        })
    }
}

const SnakeScene = {
    grid: 50,
    speedX: 0,
    speedY: 0,
    score: 0,

    gameObjects: {
        apple: Apple,
        snake: Snake
    },

    onUpdate: current => {
        const snake = current.getGameObjectsByTag('snake')

        const snakeHead = snake[snake.length-1]
        const newHead = current.instantGameObject(Snake)
        newHead.x = snakeHead.x + current.speedX
        newHead.y = snakeHead.y + current.speedY
        snake.push(newHead)

        const lastSnake = snake.shift()
        current.removeGameObject(lastSnake.name)

        if(snake.length > 1){
            snake.forEach(snake => {
                if(newHead.id !== snake.id && newHead.x === snake.x && newHead.y === snake.y){
                    current.game.resetScene()
                }
            })
        }

        if(newHead.x > current.game.width-current.grid ||
            newHead.x < 0 ||
            newHead.y > current.game.height-current.grid ||
            newHead.y < 0
        ){
            current.game.resetScene()
        }
    },

    onKeydown: ({event, current}) => {
        const snake = current.getGameObjectsByTag('snake')

        if(event.key == 'd' || event.key == 'ArrowRight') {
            current.speedY = 0
            if(snake.length > 1){
                if(current.speedX !== -50) current.speedX = 50
            }
            else current.speedX = 50
        }
        else if(event.key == 'a' || event.key == 'ArrowLeft') {
            current.speedY = 0
            if(snake.length > 1){
                if(current.speedX !== 50) current.speedX = -50
            }
            else current.speedX = -50
        }
        else if(event.key == 'w' || event.key == 'ArrowUp') {
            current.speedX = 0
            if(snake.length > 1){
                if(current.speedY !== 50) current.speedY = -50
            }
            else current.speedY = -50
        }
        else if(event.key == 's' || event.key == 'ArrowDown') {
            current.speedX = 0
            if(snake.length > 1){
                if(current.speedY !== -50) current.speedY = 50
            }
            else current.speedY = 50
        }
    },
}

const game = new Game({
    backgroundColor: '#FBFAFA',
    fps: 6,
    cursor: false,
    title: 'Snake - Pyxes',
    scenes: {
        main: SnakeScene
    },
    onKeydown: ({event, current}) => {
        // if(event.key == 'p') current.togglePause()
        if(event.key == 'r') current.resetScene()
        if(event.key == 'f') current.setFullscreen(!current.fullScreen)
    },
    // onPause: current => {
    //     current.setCursor(true)
    // },
    // onUnpause: current => {
    //     current.setCursor(false)
    // },
})

game.run()