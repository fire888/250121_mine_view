import * as THREE from 'three'
// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { Graph } from '../../AppReact/Graph.ts'
import * as MATH_HELPS from '../mathHelp.ts'
import { 
    TUNNEL_MATERIAL_PROPS, 
    COLOR_TUNNEL_FOCUS, 
    COLOR_TUNNEL, 
    COLOR_HORIZON_FOCUS,
    COLOR_TUNNEL_NOT_HORIZON,
    COLOR_TUNNEL_PICKED,
    TUNNEL_RADIUS,
} from '../CONSTANTS.ts'
import { Section } from './Section.ts'
import { Node } from './Node.ts'

type SectionsData = {
    [key: string]: Section
}
type NodesData = {
    [key: string]: Node
}

export class MeshBuilder {
    mesh: THREE.Object3D = new THREE.Object3D() 
    tunnelsMesh: THREE.Mesh | null = null
    nodeLabel: THREE.Mesh | null = null 
    nodeLabelPicked: THREE.Mesh | null = null 
    xMin: number = Infinity 
    xMax: number = -Infinity
    yMin: number = Infinity
    yMax: number = -Infinity
    zMin: number = Infinity
    zMax: number = -Infinity
    xCenter: number = 0
    yCenter: number = 0
    zCenter: number = 0 
    xW: number = 0 
    yW: number = 0 
    zW: number = 0
    graph: Graph | null = null
    sections: SectionsData = {}
    nodes: NodesData = {}
    private _currentSectionIdFocus: number | null = null
    private _currentSectionIdPicked: number | null = null
    
    init () {}

    destroy () {}

    setGraph (graph: Graph) {
        this.graph = graph
        this._calculateBounds()
    }

    drawTunnels () {
        if (!this.graph) {
            return;
        }

        const graph = this.graph
        const v: number[] = []
        const c: number[] = []
        const i: number[] = []
        let addToVertexIndex = -1

        for (let key in graph.Sections) {
            const { StartNodeId, EndNodeId } = graph.Sections[key]

            if (!graph.Nodes[StartNodeId] || !graph.Nodes[EndNodeId]) {
                continue;
            }
            const geomData = {
                v1: graph.Nodes[StartNodeId].pos,
                v2: graph.Nodes[EndNodeId].pos,
                addToVertexIndex,
            }

            const startIndex = i.length

            const tunnelMathData = MATH_HELPS.createTunnel(geomData)
            v.push(...tunnelMathData.vertices)
            c.push(...tunnelMathData.colors)
            i.push(...tunnelMathData.indices)

            addToVertexIndex = tunnelMathData.indices[tunnelMathData.indices.length - 1]

            const endIndex = i.length

            const section = new Section({
                Id: +key,
                startIndex,
                endIndex,
                startPos: geomData.v1,
                endPos: geomData.v2,
                len: tunnelMathData.len,
                quaternion: tunnelMathData.quaternion,
                startNodeId: StartNodeId,
                endNodeId: EndNodeId,
            })
            this.mesh.add(section.meshForClick)
            this.sections[key] = section
        }

        const material = new THREE.MeshPhongMaterial({
            ...TUNNEL_MATERIAL_PROPS,
            vertexColors: true,
            flatShading: false,
        })
        let geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
        const cF32 = new Float32Array(c)
        geometry.setAttribute('color', new THREE.BufferAttribute(cF32, 3))
        geometry.setIndex(i)
        geometry.computeVertexNormals()

        this.tunnelsMesh = new THREE.Mesh(geometry, material)
        this.mesh.add(this.tunnelsMesh)

        this._buildNodes()
    }

    private _buildNodes () {
        if (!this.graph) {
            return;
        }
        for (let key in this.graph.Nodes) {
            const node = new Node({ 
                Id: this.graph.Nodes[key].Id,
                pos: this.graph.Nodes[key].pos
            })
            this.mesh.add(node.meshForClick)
            this.nodes[key] = node        
        }
    }

    private _calculateBounds () {
        if (!this.graph) {
            return;
        }

        const graph = this.graph
        for (let key in graph.Nodes) {
            const [X, Y, Z] = graph.Nodes[key].pos
            if (X < this.xMin) this.xMin = X
            if (X > this.xMax) this.xMax = X
            if (Y < this.yMin) this.yMin = Y
            if (Y > this.yMax) this.yMax = Y
            if (Z < this.zMin) this.zMin = Z
            if (Z > this.zMax) this.zMax = Z
        }

        this.xW = Math.abs(this.xMax - this.xMin)
        this.yW = Math.abs(this.yMax - this.yMin)
        this.zW = Math.abs(this.zMax - this.zMin)
        this.xCenter = this.xMin + (this.xMax - this.xMin) * .5
        this.yCenter = this.yMin + (this.yMax - this.yMin) * .5
        this.zCenter = this.zMin + (this.zMax - this.zMin) * .5
    }

    getMeshesForClick (): THREE.Mesh[] {
        const arr: THREE.Mesh[] = []
        for (let key in this.sections) {
            this.sections[key].meshForClick && arr.push(this.sections[key].meshForClick)
        }
        for (let key in this.nodes) {
            this.nodes[key].meshForClick && arr.push(this.nodes[key].meshForClick)
        }
        return arr
    }

    focusOn (result: { Id: number, typeItem: string } | null) {
        if (!this.nodeLabel) {
            this.nodeLabel = new THREE.Mesh(
                new THREE.SphereGeometry(TUNNEL_RADIUS * 1.5, 32, 32),
                new THREE.MeshPhongMaterial({
                    ...TUNNEL_MATERIAL_PROPS,
                    color: 0xFF00FF,
                }),
            )
            this.mesh.add(this.nodeLabel)
        }
        this.nodeLabel.visible = false

        if (result?.typeItem === Node.typeItem) {
            const node = this.nodes[result.Id]
            const { pos } = node
            this.nodeLabel.position.set(...pos)
            this.nodeLabel.visible = true
        }

        if (this._currentSectionIdFocus !== null) {
            const { startIndex, endIndex, currentColor, isPicked } = this.sections[this._currentSectionIdFocus]
            !isPicked && this._fillSegmentByColor(startIndex, endIndex, currentColor)
        }

        this._currentSectionIdFocus = null

        if (result?.typeItem === Section.typeItem) {
            if (this._currentSectionIdFocus !== result.Id) {
                this._currentSectionIdFocus = result.Id
                const { startIndex, endIndex, isPicked } = this.sections[result.Id]
                !isPicked &&  this._fillSegmentByColor(startIndex, endIndex, COLOR_TUNNEL_FOCUS)
            }
        }
    }

    setCurrentItemPicked (typeItem: string | null, Id: number | null) {
        if (!this.mesh) return

        if (!this.nodeLabelPicked) {
            this.nodeLabelPicked = new THREE.Mesh(
                new THREE.SphereGeometry(TUNNEL_RADIUS * 1.5, 32, 32),
                new THREE.MeshPhongMaterial({
                    ...TUNNEL_MATERIAL_PROPS,
                    color: 0x0000FF,
                })
            )
            this.mesh.add(this.nodeLabelPicked)
        }

        // очистить текущую секцию
        if (this._currentSectionIdPicked) {
            this.sections[this._currentSectionIdPicked].isPicked = false
            this._fillSegmentByColor(
                this.sections[this._currentSectionIdPicked].startIndex, 
                this.sections[this._currentSectionIdPicked].endIndex, 
                this.sections[this._currentSectionIdPicked].currentColor
            )
            this._currentSectionIdPicked = null  
        } 

        // очистить текущюю ноду
        this.nodeLabelPicked.visible = false

        // показать ноду
        if (typeItem === Node.typeItem && Id) {
            this.nodeLabelPicked.visible = true
            const node = this.nodes[Id]
            const { pos } = node            
            this.nodeLabelPicked.position.set(...pos)
        }

        // показать секцию
        if (typeItem === Section.typeItem && Id) {
            this.sections[Id].isPicked = true
            this._fillSegmentByColor(this.sections[Id].startIndex, this.sections[Id].endIndex, COLOR_TUNNEL_PICKED)
            this._currentSectionIdPicked = Id
        }

    }

    highlightSections (sectionsIds: number[]) {
        if (!this.tunnelsMesh || !this.tunnelsMesh.geometry.index) return;

        const colorNotHorizon = sectionsIds.length > 0 ? COLOR_TUNNEL_NOT_HORIZON : COLOR_TUNNEL
        for (let key in this.sections) {
            this.sections[key].currentColor = colorNotHorizon
            const { startIndex, endIndex, isPicked } = this.sections[key]
            !isPicked && this._fillSegmentByColor(startIndex, endIndex, colorNotHorizon)
        }
   
        for (let i = 0; i < sectionsIds.length; ++i) {
            const sectionId = sectionsIds[i]
            if (!this.sections[sectionId]) {
                continue;
            }
            this.sections[sectionId].currentColor = COLOR_HORIZON_FOCUS
            const { startIndex, endIndex, isPicked } = this.sections[sectionId]
            !isPicked && this._fillSegmentByColor(startIndex, endIndex, this.sections[sectionId].currentColor)
        }
    }

    private _fillSegmentByColor (startIndex: number, endIndex: number, colorFill: [number, number, number]) {
        if (!this.tunnelsMesh) {
            return;
        }
        const { index } = this.tunnelsMesh.geometry
        if (!index) {
            return;
        }
        const { color } = this.tunnelsMesh.geometry.attributes
        for (let j = index.array[startIndex] * 3; j < index.array[endIndex] * 3; j += 3) {
            color.array[j] = colorFill[0]
            color.array[j + 1] = colorFill[1]
            color.array[j + 2] = colorFill[2]
        }
        color.needsUpdate = true 
    }
}
