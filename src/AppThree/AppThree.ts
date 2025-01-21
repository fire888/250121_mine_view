import xmlFileSrc from '../assets/MIM_Scheme.xml'
import { loadXMLFile } from '../helpers/loadXML.ts'
import { Graph } from './Graph.ts'
import { Ticker } from './Ticker.ts'
import { Studio } from './Studio.ts'
import { ControlsOrbit } from './Orbit.ts'
import { MeshBuilder } from './MeshBuilder.ts'

export class AppThree {
    async init (containerDomClassName: string) {
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
        meshBuilder.buildByData(graph)
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
