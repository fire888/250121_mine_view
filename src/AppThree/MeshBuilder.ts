import * as THREE from 'three'
import { Graph } from './Graph.ts'
import * as MATH_HELPS from './mathHelp.ts'
import { TUNNEL_MATERIAL_PROPS } from './CONSTANTS.ts'

export class MeshBuilder {
    mesh: THREE.Object3D
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

    init () {
        this.mesh = new THREE.Object3D() 
    }

    destroy () {}

    buildByData (graph: Graph) {
        console.log(graph)
        this._calculateBounds(graph)
        // this._createLines(graph)
        // this._createLabels(graph)
        this._createTunnels(graph)
    }


    _createTunnels (graph: Graph) {
        const v: number[] = []

        for (let key in graph.Sections) {
            const { StartNodeId, EndNodeId } = graph.Sections[key]

            if (!graph.Nodes[StartNodeId] || !graph.Nodes[EndNodeId]) {
                continue;
            }
            const geomData = {
                v1: graph.Nodes[StartNodeId].pos,
                v2: graph.Nodes[EndNodeId].pos,
            }

            const vR = MATH_HELPS.createTunnel(geomData)
            v.push(...vR)
        }

        const material = new THREE.MeshPhongMaterial(TUNNEL_MATERIAL_PROPS)
        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
        geometry.computeVertexNormals(true)
        const m = new THREE.Mesh(geometry, material)
        m.material.flatShading = true
        this.mesh.add(m)
    }

    _calculateBounds (graph: Graph) {
        for (let key in graph.Nodes) {
            const [X, Y, Z] = graph.Nodes[key].pos
            if (X < this.xMin) this.xMin = X
            if (X > this.xMax) this.xMax = X
            if (Y < this.yMin) this.yMin = Y
            if (Y > this.yMax) this.yMax = Y
            if (Z < this.zMin) this.zMin = Z
            if (Z > this.zMax) this.zMax = Z
        }

        this.xW = Math.abs(this.xMax - this.xMin) * .5
        this.yW = Math.abs(this.yMax - this.yMin) * .5
        this.zW = Math.abs(this.zMax - this.zMin) * .5
        this.xCenter = this.xMin + (this.xMax - this.xMin) * .5
        this.yCenter = this.yMin + (this.yMax - this.yMin) * .5
        this.zCenter = this.zMin + (this.zMax - this.zMin) * .5
    }

    _createLines (graph) {
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

    _createLine (v: number[], color: [number, number, number]) {
        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
        const mat = new THREE.LineBasicMaterial({ color: new THREE.Color().setRGB(color[0], color[1], color[2]) })
        const line = new THREE.Line(geometry, mat)
        this.mesh.add(line)
    }

    _createLabels (graph: Graph) {
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

    _createLabel ({ 
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
}
