import xmlFileSrc from '../assets/MIM_Scheme.xml'
import { loadXMLFile } from '../helpers/loadXML.ts'
import { Graph } from './Graph.ts'
import { Ticker } from './Ticker.ts'
import { Studio } from './Studio.ts'
import { ControlsOrbit } from './Orbit.ts'
import { MeshBuilder } from './MeshBuilder/MeshBuilder.ts'

const d = document.createElement('div')
d.innerText = '|'
d.classList.add('popup')
document.body.appendChild(d)
console.log('KKK')

export class AppThree {
    async init (containerDomClassName: string) {
        let currentId: number | null = null

        const fileData = await loadXMLFile(xmlFileSrc)
        const tiker = new Ticker()
        tiker.start()
        const studio = new Studio()
        studio.init(containerDomClassName)
        const graph = new Graph()
        graph.parse(fileData)
        const meshBuilder = new MeshBuilder()
        meshBuilder.init()
        studio.add(meshBuilder.mesh)
        meshBuilder.setGraph(graph)
        /** нарисовать туннели */
        meshBuilder.drawTunnels()
        /** кидаем меши для наведения курсора в специальный массив */
        studio.setMeshForClick(meshBuilder.getMeshesForClick())
        /** вешаем коллбэк на меши под курсором */ 
        studio.setCbOnFocus((Id: number | null): void => { 
            meshBuilder.focusOn(Id)
            document.body.style.cursor = Id ? 'pointer' : ''
            d.innerText = Id ? graph.getMessageById(Id) : '|'
            currentId = Id
        })
        /** нарисовать линии между узлами */
        // meshBuilder.drawLines()
        /** нарисовать метки с выводом ай-ди узлов */
        // meshBuilder.drawLabels()
        studio.camera.position.set(meshBuilder.xCenter, meshBuilder.yCenter, meshBuilder.zMax + meshBuilder.zW * .3)
        studio.cameraLookAt(meshBuilder.xCenter, meshBuilder.yCenter, meshBuilder.zCenter)
        const controls = new ControlsOrbit()
        controls.init(studio.camera, studio.containerDom)
        controls.setTargetCoords(meshBuilder.xCenter, meshBuilder.yCenter, meshBuilder.zCenter)
        controls.enable()
        tiker.on(() => {
            controls.update()
            studio.render()
        })
    } 
}
