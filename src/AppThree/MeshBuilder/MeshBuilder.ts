import * as THREE from 'three'
import { Graph } from '../Graph.ts'
import * as MATH_HELPS from '../mathHelp.ts'
import { TUNNEL_MATERIAL_PROPS, COLOR_TUNNEL_FOCUS, COLOR_TUNNEL, COLOR_HORIZON_FOCUS } from '../CONSTANTS.ts'
import { Section } from './Section.ts'

type SectionsData = {
    [key: string]: Section
}

export class MeshBuilder {
    mesh: THREE.Object3D = new THREE.Object3D() 
    tunnelsMesh: THREE.Mesh | null = null
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
    private _currentSectionIdFocus: number | null = null
    private _currentHorizonNodes: number[] = []
    
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

        for (let key in graph.Sections) {
            const { StartNodeId, EndNodeId } = graph.Sections[key]

            if (!graph.Nodes[StartNodeId] || !graph.Nodes[EndNodeId]) {
                continue;
            }
            const geomData = {
                v1: graph.Nodes[StartNodeId].pos,
                v2: graph.Nodes[EndNodeId].pos,
            }

            const startIndexV = v.length
            const startIndexC = c.length

            const tunnelMathData = MATH_HELPS.createTunnel(geomData)
            v.push(...tunnelMathData.v)
            c.push(...tunnelMathData.c)

            const endIndexV = v.length
            const endIndexC = c.length

            const section = new Section({
                Id: +key,
                startIndexV,
                endIndexV,
                startIndexC,
                endIndexC,
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

        const material = new THREE.MeshPhongMaterial(TUNNEL_MATERIAL_PROPS)
        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
        geometry.computeVertexNormals()
        const cF32 = new Float32Array(c)
        geometry.setAttribute('color', new THREE.BufferAttribute(cF32, 3))
        this.tunnelsMesh = new THREE.Mesh(geometry, material)
        this.mesh.add(this.tunnelsMesh)
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

    drawLines () {
        if (!this.graph) {
            return;
        }

        const graph = this.graph
        for (let key in graph.Sections) {
            const { StartNodeId, EndNodeId } = graph.Sections[key]

            if (!graph.Nodes[StartNodeId] || !graph.Nodes[EndNodeId]) {
                continue;
            }

            const v = [
                ...graph.Nodes[StartNodeId].pos,
                ...graph.Nodes[EndNodeId].pos
            ]
            this._createLine(v, [Math.random(), Math.random(), Math.random()])
        }
    }

    private _createLine (v: number[], color: [number, number, number]) {
        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
        const mat = new THREE.LineBasicMaterial({ color: new THREE.Color().setRGB(color[0], color[1], color[2]) })
        const line = new THREE.Line(geometry, mat)
        this.mesh.add(line)
    }

    drawLabels () {
        if (!this.graph) {
            return;
        }

        const graph = this.graph
        const nodeGeom = new THREE.BoxGeometry(2, 2, 2)
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xfffff })
        for (let key in graph.Nodes) {
            const { pos } = graph.Nodes[key]
            const m = new THREE.Mesh(
                nodeGeom, 
                nodeMat,
            )
            m.position.set(...pos)
            this.mesh.add(m)
            this._createLabel({ 
                text: key, 
                color: [1, 1, 1], 
                colorBack: null, 
                pos, 
            })
        }
    }  

    private _createLabel ({ 
        text, 
        color, 
        colorBack = null, 
        pos
    }: {
        text: string,
        color: [number, number, number,]
        colorBack: [number, number, number,] | null,
        pos: [number, number, number]
    }) {
        const canvas = document.createElement( 'canvas' );
        const ctx = canvas.getContext( '2d' );

        if (!ctx) {
            return;
        }

        canvas.width = 128 * (text.length * .5);
        canvas.height = 128;

        if (colorBack) {
            const hex = MATH_HELPS.rgb2hex(...color)
            ctx.fillStyle = hex
            ctx.fillRect( 0, 0, 128 * (text.length * .5), 128 );
        }

        const hex = MATH_HELPS.rgb2hex(...color)
        ctx.fillStyle = hex
        ctx.font = 'bold 60pt arial'
        ctx.textAlign = "left"
        ctx.fillText(text, 0, 100)

        const map = new THREE.CanvasTexture( canvas )
        const material = new THREE.SpriteMaterial({ map: map })

        const sprite = new THREE.Sprite(material)
        sprite.position.set(...pos)
        sprite.scale.set(5, 5, 5)

        this.mesh.add(sprite)
    }

    getMeshesForClick (): THREE.Mesh[] {
        const arr: THREE.Mesh[] = []
        for (let key in this.sections) {
            this.sections[key].meshForClick && arr.push(this.sections[key].meshForClick)
        }
        return arr
    }

    focusOn (Id: number | null) {
        if (this._currentSectionIdFocus !== null && this._currentSectionIdFocus !== Id) {
            const { startIndexC, endIndexC, currentColor } = this.sections[this._currentSectionIdFocus]
            this._fillSegmentByColor(startIndexC, endIndexC, currentColor)
        }
        if (Id !== null && this._currentSectionIdFocus !== Id) {
            this._currentSectionIdFocus = Id
            const { startIndexC, endIndexC } = this.sections[Id]
            this._fillSegmentByColor(startIndexC, endIndexC, COLOR_TUNNEL_FOCUS)
        }
        this._currentSectionIdFocus = Id
    }

    drawRedColorNodes (nodesIds: number[]) {
        for (let i = 0; i < this._currentHorizonNodes.length; ++i) {
            const nodeId = this._currentHorizonNodes[i]
            if (!this.sections[nodeId]) {
                continue
            }
            this.sections[nodeId].currentColor = COLOR_TUNNEL
            const { startIndexC, endIndexC } = this.sections[nodeId]
            this._fillSegmentByColor(startIndexC, endIndexC, this.sections[nodeId].currentColor)
        }  
        this._currentHorizonNodes = nodesIds     
        for (let i = 0; i < nodesIds.length; ++i) {
            const nodeId = nodesIds[i]
            if (!this.sections[nodeId]) {
                continue
            }
            this.sections[nodeId].currentColor = COLOR_HORIZON_FOCUS
            const { startIndexC, endIndexC } = this.sections[nodeId]
            this._fillSegmentByColor(startIndexC, endIndexC, this.sections[nodeId].currentColor)
        }
    }

    _fillSegmentByColor (startIndexC: number, endIndexC: number, colorFill: [number, number, number]) {
        if (!this.tunnelsMesh) {
            return
        }
        const { color } = this.tunnelsMesh.geometry.attributes
        for (let j = startIndexC; j < endIndexC; j += 3) {
            color.array[j] = colorFill[0]
            color.array[j + 1] = colorFill[1]
            color.array[j + 2] = colorFill[2]
        }
        color.needsUpdate = true 
    }
}
