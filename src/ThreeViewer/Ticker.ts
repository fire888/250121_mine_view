export class Ticker {
    isRunning = false
    private _updates: { (t: number): void }[] = []
    private _oldTime = Date.now()

    start () {
        this._oldTime = Date.now()
        this.isRunning = true
        this.tick()
    }

    stop () {
        this.isRunning = false
    }

    tick () {
        if (!this.isRunning) {
            return
        }
        requestAnimationFrame(this.tick.bind(this))

        const diff = Date.now() - this._oldTime
        this._oldTime = Date.now()
        this._updates.forEach(f => f(diff))
    }

    on (f: (t: number) => void) {
        this._updates.push(f)
        return () => {
            this._updates.filter(item => item !== f)
        }
    }
}
