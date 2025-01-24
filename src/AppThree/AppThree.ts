// @ts-ignore
import xmlFileSrc from '../assets/MIM_Scheme.xml'
import { loadXMLFile } from '../helpers/loadXML.ts'
import { Graph } from './Graph.ts'
import { Ticker } from './Ticker.ts'
import { Studio } from './Studio.ts'
import { ControlsOrbit } from './Orbit.ts'
import { MeshBuilder } from './MeshBuilder/MeshBuilder.ts'

type ConnectorProps = {
    props: {
        setHorizonsNames: (horizonsNames: string[]) => void
        showApplication: () => void
        setValuePopupCoords: (x: number, y: number) => void
        setValuePopupInfo: (text: string) => void
    }
}

export class AppThree {
    private _graph: Graph | null = null
    private _meshBuilder: MeshBuilder | null = null 

    async init (parentDom: HTMLElement | null, connectorToThreeApp: ConnectorProps) {
        let currentId: number | null = null 

        const fileData = await loadXMLFile(xmlFileSrc)
        const tiker = new Ticker()
        tiker.start()
        const studio = new Studio()
        this._graph = new Graph()
        this._graph.parse(fileData)
        this._meshBuilder = new MeshBuilder()
        this._meshBuilder.init()
        this._meshBuilder.mesh && studio.add(this._meshBuilder.mesh)
        this._meshBuilder.setGraph(this._graph)
        /** нарисовать туннели */
        this._meshBuilder.drawTunnels()
        /** кладем меши для наведения курсора в специальный массив */
        studio.setMeshForClick(this._meshBuilder.getMeshesForClick())
        /** вешаем коллбэк на меши под курсором */ 
        studio.setCbOnFocus((Id: number | null): void => { 
            this._meshBuilder && this._meshBuilder.focusOn(Id)
            document.body.style.cursor = Id ? 'pointer' : ''
            currentId = Id
            this._graph && connectorToThreeApp.props &&
                connectorToThreeApp.props.setValuePopupInfo(Id ? this._graph.getMessageById(Id) : '')
        })
        /** нарисовать линии между узлами */
        // meshBuilder.drawLines()
        /** нарисовать метки с выводом ай-ди узлов */
        // meshBuilder.drawLabels()

        const { xCenter, yCenter, zCenter, zMax, zW } = this._meshBuilder
        studio.camera.position.set(xCenter, yCenter, zMax + zW * .3)
        studio.cameraLookAt(xCenter, yCenter, zCenter)
        const controls = new ControlsOrbit()
        controls.init(studio.camera, studio.containerDom)
        controls.setTargetCoords(xCenter, yCenter, zCenter)
        controls.enable()

        tiker.on(() => {
            controls.update()
            studio.render()
            if (currentId) {
                /** передаем координаты курсора в реакт */ 
                // TODO: наверное лучше не прокидывать координаты а брать текущие координаты курсора подумать
                const wWH = window.innerWidth * .5
                const wHH = window.innerHeight * .5
                connectorToThreeApp.props.setValuePopupCoords(
                    studio.pointer.x * wWH + wWH,
                    -studio.pointer.y * wHH + wHH
                )
            }
        })

        parentDom && studio.setDomParent(parentDom)
        connectorToThreeApp.props.setHorizonsNames(this._graph.getHorizonsNames())
        connectorToThreeApp.props.showApplication()
    }

    setNewHorizonName (horizonName: string) {
        if (!this._graph || !this._meshBuilder) {
            return
        }
        const nodes: number[] = this._graph.getNodesByHorizonName(horizonName) 
        this._meshBuilder.drawRedColorNodes(nodes)
    } 
}
