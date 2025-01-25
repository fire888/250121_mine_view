import * as THREE from 'three'

export class Studio {
    containerDom: HTMLElement
    camera: THREE.PerspectiveCamera
    scene: THREE.Scene
    pointer: THREE.Vector2 = new THREE.Vector2()

    private _renderer: THREE.WebGLRenderer
    private _hemiLight: THREE.HemisphereLight
    private _dirLight: THREE.DirectionalLight

    private _meshesForClick: THREE.Mesh[] = []
    private _raycaster: THREE.Raycaster = new THREE.Raycaster()
    private _cbsOnMouseOver: ((val: number | null) => void)[] = []
    private _currentMeshIdMouseOver: number | null = null

    constructor () {
        this.containerDom = document.createElement('div')
        this.containerDom.classList.add('three-viewer')

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .001, 100000)
        this.camera.position.set(0, 0, 500)
        this.camera.lookAt(0, 0, 0)

        this.scene = new THREE.Scene()

        this._hemiLight = new THREE.HemisphereLight(0x48534a, 0xffffff, 4)
        this._hemiLight.position.set( 0, 20, 0 )
        this.scene.add(this._hemiLight)

        this._dirLight = new THREE.DirectionalLight(0xffffff, 7)
        this._dirLight.position.set(-3, 10, 2)
        this.scene.add(this._dirLight)

        this._renderer = new THREE.WebGLRenderer({ antialias: true })
        this._renderer.setPixelRatio(window.devicePixelRatio)
        this._renderer.setSize(window.innerWidth, window.innerHeight)
        this.containerDom.appendChild(this._renderer.domElement)

        window.addEventListener('resize', this._onWindowResize.bind(this))
        this._onWindowResize()

        window.addEventListener('pointermove', this._onPointerMove.bind(this))
        window.addEventListener('pointerdown', this._onPointeDown.bind(this))

        this.render()
    }

    setDomParent (elem: HTMLElement) {
        elem.appendChild(this.containerDom)
        this._onWindowResize()
    }

    render () {
        this._raycaster.setFromCamera(this.pointer, this.camera)
        const intersects = this._raycaster.intersectObjects(this._meshesForClick, true)
        const result = intersects[0] 
            ? intersects[0].object.userData.Id
            : null

        if (result !== this._currentMeshIdMouseOver) {
            this._currentMeshIdMouseOver = result
            this._cbsOnMouseOver.forEach(cb => cb(result))
        }

        this._renderer.render(this.scene, this.camera)
    }

    private _onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this._renderer.setSize(window.innerWidth, window.innerHeight)
    }

    private _onPointerMove (e: PointerEvent) {
        this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1
        this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1
    }

    private _onPointeDown (e: PointerEvent) {
        this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1
        this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1

        this._raycaster.setFromCamera(this.pointer, this.camera)
        const intersects = this._raycaster.intersectObjects(this._meshesForClick, true)
        const result = intersects[0] 
            ? intersects[0].object.userData.Id
            : null

        if (result !== this._currentMeshIdMouseOver) {
            this._currentMeshIdMouseOver = result
            this._cbsOnMouseOver.forEach(cb => cb(result))
        }
    } 

    add (m: THREE.Object3D) {
        this.scene.add(m)
    }

    remove (m: THREE.Object3D) {
        this.scene.remove(m)
    }

    addAxisHelper () {
        const axesHelper = new THREE.AxesHelper(15)
        this.scene.add(axesHelper)
    }

    cameraLookAt (x: number, y: number, z: number) {
        this.camera.lookAt(x, y, z)
    }

    setMeshForMouseOver (e: THREE.Mesh | THREE.Mesh[]) {
        if (Array.isArray(e)) {
            this._meshesForClick.push(...e)
        } else {
            this._meshesForClick.push(e)
        } 
    }

    setCbOnMouseOver (cb: (val: number | null) => void): void {
        this._cbsOnMouseOver.push(cb)
    }
}
