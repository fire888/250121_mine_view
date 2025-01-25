// @ts-ignore
import xmlFileSrc from '../assets/MIM_Scheme.xml'
import { loadXMLFile } from '../helpers/loadXML'
import { Graph } from './Graph'
import { Ticker } from './Ticker'
import { Studio } from './Studio'
import { ControlsOrbit } from './Orbit'
import { MeshBuilder } from './MeshBuilder/MeshBuilder'

export interface IThreeConnector {
    showApplication: () => void
    setValuePopupInfo: (text: string) => void
    setHorizonsNames: (horizonsNames: string[]) => void
    setValuePopupCoords: (x: number, y: number) => void
}

export class AppThree {
    private _graph: Graph | null = null
    private _meshBuilder: MeshBuilder | null = null

    async init(
        parentDom: HTMLElement | null,
        connector: IThreeConnector // Объект с коллбэками
    ) {
        let currentId: number | null = null

        const fileData = await loadXMLFile(xmlFileSrc)
        const ticker = new Ticker()
        ticker.start()

        const studio = new Studio()
        this._graph = new Graph()
        this._graph.parse(fileData)

        this._meshBuilder = new MeshBuilder()
        this._meshBuilder.init()
        studio.add(this._meshBuilder.mesh)
        this._meshBuilder.setGraph(this._graph)
        this._meshBuilder.drawTunnels()

        // Коллбэк на наведении мыши
        studio.setMeshForMouseOver(this._meshBuilder.getMeshesForClick())
        studio.setCbOnMouseOver((Id: number | null): void => {
            if (this._meshBuilder) {
                this._meshBuilder.focusOn(Id)
            }
            document.body.style.cursor = Id ? 'pointer' : '';
            currentId = Id;
            // При наведении — проброс информации вверх в React
            if (this._graph && connector) {
                connector.setValuePopupInfo(
                    Id ? this._graph.getMessageById(Id) : ''
                )
            }
        })

        const { xCenter, yCenter, zCenter, zMax, zW } = this._meshBuilder
        studio.camera.position.set(xCenter, yCenter, zMax + zW * 0.3)
        studio.cameraLookAt(xCenter, yCenter, zCenter)

        const controls = new ControlsOrbit()
        controls.init(studio.camera, studio.containerDom)
        controls.setTargetCoords(xCenter, yCenter, zCenter)
        controls.enable()

        ticker.on(() => {
            controls.update()
            studio.render()

            // eсли есть выделенный элемент — двигаем подсказку
            if (currentId) {
                const wWH = window.innerWidth * 0.5
                const wHH = window.innerHeight * 0.5
                connector.setValuePopupCoords(
                    studio.pointer.x * wWH + wWH,
                    -studio.pointer.y * wHH + wHH
                );
            }
        });

        // Вставляем canvas в переданный DOM
        parentDom &&studio.setDomParent(parentDom)

        // Отправляем названия горизонтов в Redux
        connector.setHorizonsNames(this._graph.getHorizonsNames())

        // Сигнализируем "приложение готово"
        connector.showApplication()
    }

    setCurrentHorizonName(horizonName: string) {
        if (!this._graph || !this._meshBuilder) return

        const nodes = this._graph.getNodesByHorizonName(horizonName)
        this._meshBuilder.drawRedColorNodes(nodes)
    }
}
