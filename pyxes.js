
class Game {
    constructor({
        width = 500,
        height = 500,
        id = 'game',
        title = 'Title',
        backgroundColor = '#fff',
        cursor = true,
        fps = 60,
        events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseout', 'mouseover', 'change', 'focus', 'blur', 'select', 'keydown', 'keyup', 'load', 'unload'],
        contextMenu = false,
        running = false,
        fullScreen = false
    }) {
        this.cv = document.getElementById(id)
        if(!this.cv) {
            this.cv = document.createElement("canvas")
            this.cv.classList.add(id);
            this.cv.setAttribute('id', 'game');
        }
        this.ctx = this.cv.getContext("2d");

        if(!document.body.contains(this.cv)) document.body.appendChild(this.cv)

        this.setSize(width, height)
        this.setBackgroundColor(backgroundColor)
        this.setCursor(cursor)

        this.fullScreen = fullScreen
        if(fullScreen === true) this.setFullscreen(fullScreen)

        this.title = title
        document.title = this.title

        this.events = events
        if (this.onLoad && typeof this.onLoad === 'function') this.onLoad()

        this.events.forEach(eventName => {
            window.addEventListener(eventName, event => {
                const methodEventName = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1).toLowerCase()}`
                if (this[methodEventName] && typeof this[methodEventName] === 'function') this[methodEventName](event)
            })
        })

        this.fps = fps

        this.contextMenu = contextMenu
        if (!this.contextMenu) this.cv.addEventListener('contextmenu', this.disableContextMenu)

        this.running = running
    }

    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    run(){
        this.lastTick = Date.now()
        this.deltaTime = 0

        const update = () => {
            const now = Date.now();
            this.deltaTime = (now - this.lastTick)/1000;
            this.currentFPS = 1000 / (now - this.lastTick)
            this.lastTick = now

            this.ctx.save()
            this.clear()

            this.ctx.translate(this.width/2, this.height/2)
            // this.ctx.scale(this.camera.zoom, this.camera.zoom);
            // this.ctx.translate(-(this.camera.x + this.camera.shake.x), -(this.camera.y + this.camera.shake.y))

            if (this.onUpdate && typeof this.onUpdate === 'function') this.onUpdate()
            if (this.onRender && typeof this.onRender === 'function') this.onRender()

            this.ctx.restore()
        }

        this.updateInterval = setInterval(update, 1000/this.fps);
    }

    stop(){
        clearInterval(this.updateInterval)
    }

    setSize(width, height){
        this.width = width;
        this.height = height;

        this.cv.width = width;
        this.cv.height = height;
    }

    setBackgroundColor(backgroundColor){
        this.backgroundColor = backgroundColor
        this.cv.style.backgroundColor = backgroundColor
    }

    setCursor(x){
        x ? this.cv.style.cursor = "default" : this.cv.style.cursor = "none"
    }

    disableContextMenu(event) {
        event.preventDefault()
    }

    enableContextMenu() {
        this.contextMenu = true
        this.cv.removeEventListener('contextmenu', this.disableContextMenu)
    }

    screenshot(){
        return this.cv.toDataURL('image/png')
    }

    downloadScreenshot(){
        const a = document.createElement("a")
        a.href = this.screenshot()
        a.download = `${document.title} - screenshot.png`;
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    setFPS(fps){
        clearInterval(this.updateInterval)
        this.fps = fps
        this.updateListener()
    }

    getMousePosition(event){
        const rect = this.cv.getBoundingClientRect();
        this.getMouse = {
            x: (event.clientX - rect.left) - (-this.camera.x + this.width/2),
            y: (event.clientY - rect.top) - (-this.camera.y + this.height/2)
        }
    }

    setFullscreen(tmp = true){
        if(tmp === true){
            this.fullScreen = true
            try {
                if (this.cv.requestFullscreen) {
                    this.cv.requestFullscreen()
                } else if (this.cv.webkitRequestFullscreen) {
                    this.cv.webkitRequestFullscreen()
                } else if (this.cv.msRequestFullscreen) {
                    this.cv.msRequestFullscreen()
                }
            } catch (error) {}
        }else{
            this.fullScreen = false
            try {
                document.exitFullscreen()
            } catch (error) {;}
        }
    }
}