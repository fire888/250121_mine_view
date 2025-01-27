import * as THREE from 'three'
import * as MATH_HELPS from '../mathHelp.ts'
import * as CONSTANTS from '../CONSTANTS.ts'

export class Node {
    static materialMeshMouse: THREE.MeshBasicMaterial
    static typeItem: string = 'Node'

    Id: number
    pos: [number, number, number]
    currentColor = CONSTANTS.COLOR_TUNNEL
    isPicked: boolean = false
    meshForClick: THREE.Mesh

    constructor ({
        Id,
        pos,
    }: {
        Id: number
        pos: [number, number, number]
    }) {
        this.Id = Id
        this.pos = pos

        this.meshForClick = this._createMeshMouse()
    }

    private _createMeshMouse () {
        if (!Node.materialMeshMouse) {
            Node.materialMeshMouse = new THREE.MeshBasicMaterial({ 
                color: 0xffff00,
                side: THREE.DoubleSide, 
            })
        }

        const R = CONSTANTS.TUNNEL_RADIUS
        const d = R * 1.3

        const v = [
            // top
            ...MATH_HELPS.createPolygon(
                [-d, d, d],
                [d, d, d],
                [d, d, -d],
                [-d, d, -d],
            ),
            // bottom
            ...MATH_HELPS.createPolygon(
                [-d, -d, d],
                [d, -d, d],
                [d, -d, -d],
                [-d, -d, -d],
            )
        ]

        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
        this.meshForClick = new THREE.Mesh(geometry, Node.materialMeshMouse)
        this.meshForClick.position.set(...this.pos)
        this.meshForClick.userData.Id = this.Id
        this.meshForClick.userData.typeItem = Node.typeItem
        this.meshForClick.visible = false
        return this.meshForClick
    }
}
