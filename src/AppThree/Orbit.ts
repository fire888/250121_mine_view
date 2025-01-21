import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'

export class ControlsOrbit {
    controls: OrbitControls
    isEnabled: Boolean = false
    constructor () {}

    init (camera: THREE.PerspectiveCamera, domElem: HTMLElement) {
        this.controls = new OrbitControls(camera, domElem)
        this.controls.target.set(0, 0, 0)
        this.controls.enablePan = true
        this.controls.enableDamping = true
        this.controls.enabled = false
        this.controls.panSpeed = 1
        this.controls.zoomSpeed = 1
    }

    setTargetCoords (x: number, y: number, z: number) {
        this.controls.target.set(x, y, z)
        this.controls.update()
    }

    enable () {
        this.isEnabled = true
        this.controls.enabled = true
    }

    disable () {
        this.isEnabled = false
        this.controls.enabled = false
    }

    update () {
        if (!this.controls.enabled) {
            return;
        }
        if (!this.isEnabled) {
            return
        }
        this.controls.update()
    }
}
