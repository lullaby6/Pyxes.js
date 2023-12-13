

class Test extends Game {
    constructor(props) {
        super(props)
    }

    onKeydown() {
        console.log('keydown');
    }

    onUpdate(){
        console.log('bayman');
    }
}

const game = new Test({
    backgroundColor: 'red',
    fullScreen: true,
})

game.run()