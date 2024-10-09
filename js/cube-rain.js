const Cube = {
    color: '#fff',
    tags: ['cube'],
    border: {
        size: 1,
        color: '#000'
    },

    onLoad: current => {
        current.reset(current)
    },

    onUpdate: current => {
        current.y += current.speed

        if (current.y > current.scene.game.height) current.scene.game.resetScene()

        current.scene.game.ctx.fillStyle = current.border.color

        current.scene.game.ctx.fillRect(current.x - current.border.size, current.y - current.border.size, current.width + (current.border.size * 2), current.height + (current.border.size * 2))
    },

    reset: current => {
        const size = randomIntFromInterval(current.scene.game.width/12.5, current.scene.game.width/7.5)

        const range = Math.abs(500 - (current.scene.score * 2))

        console.log(range);

        const speed = randomIntFromInterval(current.scene.game.height/range, current.scene.game.height/(range/2))

        current.speed = speed

        current.setSize(size, size)

        current.y = -size
        current.x = randomIntFromInterval(0, (current.scene.game.width - size))
    },

    onCurrentClick: ({current}) => {
        current.reset(current)

        const cubesLength = current.scene.getGameObjectsByTag('cube').length

        current.scene.score += 1

        const newCubesLength = parseInt(Math.max(1, current.scene.score / 5))

        if (newCubesLength > cubesLength) {
            for (let i = 0; i < newCubesLength - cubesLength; i++) {
                current.scene.instantGameObject(Cube)
            }
        }
    }
}

const MainScene = {
    score: 0,

    onLoad: current => {
        current.instantGameObject(Cube)
    },

    onUpdate: current => {

    },

    onKeydown: ({event, current}) => {

    },
}

let windowHeight = window.innerHeight
let width = (9*windowHeight)/16

const game = new Game({
    backgroundColor: '#FBFAFA',
    fps: 60,
    limitFPS: true,
    // cursor: false,
    title: 'Cube Rain - Pyxes',
    width: width,
    height: windowHeight,

    scenes: {
        main: MainScene
    },

    onLoad: current => {
        window.addEventListener('resize', () => {
            windowHeight = window.innerHeight
            width = parseInt((9*windowHeight)/16)

            current.setSize(width, windowHeight)
        })
    },

    onKeydown: ({event, current}) => {
        if (event.key == 'p') current.togglePause()
        else if (event.key == 'r') current.resetScene()
        else if (event.key == 'f') current.toggleFullscreen()
    },

    onPause: current => {
        // current.setCursorVisibility(true)
    },
    onResume: current => {
        // current.setCursorVisibility(false)
    }
})

game.run()