import { Graph } from '../AppReact/Graph'
import { Ticker } from './Ticker'
import { Studio } from './Studio'
import { ControlsOrbit } from './Orbit'
import { MeshBuilder } from './MeshBuilder/MeshBuilder'

export class ThreeViewer {
    graph: Graph | null = null
    private _studio: Studio | null = null
    private _meshBuilder: MeshBuilder | null = null
    private _cbOnMouseOverElement: (val: number | null) => void = () => {}

    async build() {
        const ticker = new Ticker()
        ticker.start()

        this._studio = new Studio()

        this._meshBuilder = new MeshBuilder()
        this._meshBuilder.init()
        this._studio.add(this._meshBuilder.mesh)

        if (!this.graph) {
            return;
        }

        this._meshBuilder.setGraph(this.graph)
        this._meshBuilder.drawTunnels()

        // Коллбэк при наведении мыши
        this._studio.setMeshForMouseOver(this._meshBuilder.getMeshesForClick())
        this._studio.setCbOnMouseOver((Id: number | null): void => {
            if (!this._meshBuilder) return;
            
            this._meshBuilder.focusOn(Id)
            this._cbOnMouseOverElement(Id)
        })

        const { xCenter, yCenter, zCenter, zMax, zW } = this._meshBuilder
        this._studio.camera.position.set(xCenter, yCenter, zMax + zW * 0.3)
        this._studio.cameraLookAt(xCenter, yCenter, zCenter)

        const controls = new ControlsOrbit()
        controls.init(this._studio.camera, this._studio.containerDom)
        controls.setTargetCoords(xCenter, yCenter, zCenter)
        controls.enable()

        ticker.on(() => {
            if (!this._studio) return

            controls.update()
            this._studio.render()
        })
    }

    setGraph(graph: Graph) {
        this.graph = graph
    }

    setCurrentSectorPicked (Id: number | null) {
        if (!this._meshBuilder) return;
        this._meshBuilder.setCurrentSectorPicked(Id)
    }

    setCurrentHorizonName(horizonName: string) {
        if (!this.graph || !this._meshBuilder) return;

        const sections = this.graph.getSectionsByHorizonName(horizonName)
        this._meshBuilder.highlightSections(sections)
    }

    appendParentDomContainer (domContainer: HTMLElement | null) {
        if (!domContainer) return;
        if (!this._studio) return;

        this._studio.setDomParent(domContainer)
    }

    onMouseOver (cb: (val: number | null) => void) {
        this._cbOnMouseOverElement = cb
    }
}
