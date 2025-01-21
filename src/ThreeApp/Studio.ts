import * as THREE from 'three'

export class Studio {
    containerDom: HTMLElement
    camera: THREE.PerspectiveCamera
    scene: THREE.Scene
    fog: THREE.Fog
    hemiLight: THREE.HemisphereLight
    dirLight: THREE.DirectionalLight
    renderer: THREE.WebGLRenderer
    spotLight: THREE.SpotLight

    init (containerDomClassName: string) {
        this.containerDom = document.querySelector(`.${containerDomClassName}`)
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .001, 100000)
        this.camera.position.set(0, 0, 500)
        this.camera.lookAt(0, 0, 0)

        this.scene = new THREE.Scene()

        this.hemiLight = new THREE.HemisphereLight(0x48534a, 0xffffff, 3)
        this.hemiLight.position.set( 0, 20, 0 )
        this.scene.add(this.hemiLight)

        this.dirLight = new THREE.DirectionalLight(0xffffff, 5)
        this.dirLight.position.set(-3, 10, 2)
        this.scene.add(this.dirLight)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.containerDom.appendChild(this.renderer.domElement)

        window.addEventListener('resize', this.onWindowResize.bind(this))
        this.onWindowResize()

        this.render()
    }

    render () {
        this.renderer.render(this.scene, this.camera)
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
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
}
