import * as THREE from 'three'
import * as MATH_HELPS from '../mathHelp.ts'
import * as CONSTANTS from '../CONSTANTS.ts'

export class Section {
    static materialMeshMouse: THREE.MeshBasicMaterial
    static typeItem: string = 'Section'

    Id: number
    startIndexV: number 
    endIndexV: number
    startIndexC: number 
    endIndexC: number
    startPos: [number, number, number]
    endPos: [number, number, number]
    len: number
    quaternion: THREE.Quaternion
    meshForClick: THREE.Mesh 
    startNodeId: number
    endNodeId: number
    currentColor = CONSTANTS.COLOR_TUNNEL

    constructor ({
        Id,
        startIndexV,
        endIndexV,
        startIndexC,
        endIndexC,
        startPos,
        endPos,
        len,
        quaternion,
        startNodeId,
        endNodeId,
    }: {
        Id: number
        startIndexV: number
        endIndexV: number
        startIndexC: number
        endIndexC: number
        startPos: [number, number, number]
        endPos: [number, number, number]
        len: number
        quaternion: THREE.Quaternion
        startNodeId: number
        endNodeId: number
    }) {
        this.Id = Id
        this.startIndexV = startIndexV
        this.endIndexV = endIndexV
        this.startIndexC = startIndexC
        this.endIndexC = endIndexC
        this.startPos = startPos
        this.endPos = endPos
        this.len = len
        this.startNodeId = startNodeId
        this.endNodeId = endNodeId
        this.quaternion = quaternion

        this.meshForClick = this._createMeshMouse()
    }

    private _createMeshMouse () {
        if (!Section.materialMeshMouse) {
            Section.materialMeshMouse = new THREE.MeshBasicMaterial({ 
                color: 0xffff00,
                side: THREE.DoubleSide, 
            })
        }

        const R = CONSTANTS.TUNNEL_RADIUS
        const d = R * 3

        const v = [
            // gor 
            ...MATH_HELPS.createPolygon(
                [0, 0, d],
                [this.len, 0, d],
                [this.len, 0, -d],
                [0, 0, -d],
            ),
            // vert
            ...MATH_HELPS.createPolygon(
                [0, -d, 0],
                [this.len, -d, 0],
                [this.len, d, 0],
                [0, d, 0],
            ), 
        ]

        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
        this.meshForClick = new THREE.Mesh(geometry, Section.materialMeshMouse)
        this.meshForClick.position.set(...this.startPos)
        this.meshForClick.quaternion.copy(this.quaternion)
        this.meshForClick.userData.Id = this.Id
        this.meshForClick.userData.typeItem = Section.typeItem
        this.meshForClick.visible = false

        return this.meshForClick
    }
}
