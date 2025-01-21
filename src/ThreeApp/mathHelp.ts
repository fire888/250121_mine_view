import * as THREE from 'three'
import { TUNNEL_DIAMETER, TUNNEL_DIAMETER_QUALITY_N } from './CONSTANTS.ts'

type A3 = [number, number, number]
type VPolygon = number[18]

const componentToHex = (c: number): string => {
    c *= 256
    c = Math.floor(c) - 1
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

export const rgb2hex = (r: number, g: number, b: number): string => {
    const rS = componentToHex(r)
    const gS = componentToHex(g)
    const bS = componentToHex(b)
    return '#' + rS + gS + bS
}

export const angle = (x: number, y: number): number => {
    let rad = Math.atan(y / x)
    x < 0 && y > 0 && (rad = Math.PI - Math.abs(rad))
    x < 0 && y <= 0 && (rad = Math.PI + Math.abs(rad))
    rad += Math.PI * 6
    rad = rad % (Math.PI * 2)
    return rad
}

export const angleLine4coord = (x1: number, y1: number, x2: number, y2: number): number => {
    const x = x2 - x1
    const y = y2 - y1
    return angle(x, y)
}

export const createPolygon = (v0: A3, v1: A3, v2: A3, v3: A3): VPolygon => {
    return [...v0, ...v1, ...v2, ...v0, ...v2, ...v3]
}

const W = TUNNEL_DIAMETER
const N = TUNNEL_DIAMETER_QUALITY_N
const vS = new THREE.Vector3()
const vE = new THREE.Vector3()
const defaultDir = new THREE.Vector3(1, 0, 0)
const S: number[] = [
    -W * .5,   0,    0,
    -W * .5,   0,    W * .5,
    0,    0,    W,
]
const E: number[] = [
    0, 0, W,
    W * .5, 0, W * .5,
    W * .5, 0, 0,
]

export const createTunnel = ({ v1, v2 }: { v1: A3, v2: A3 }): number[] => {
    vS.fromArray(v1)
    vE.fromArray(v2)
    const l = vS.distanceTo(vE)

    const eCopy = [...E]
    translateVertices(eCopy, l, 0, 0)

    const profile = [...S, ...eCopy]

    const profiles: number[][] = []
    for (let i = 0; i < N; ++i) {
        const a = i / N * Math.PI * 2

        const z1 = Math.cos(a)
        const y1 = Math.sin(a)
        const p: number[] = []
        for (let j = 0; j < profile.length; j += 3) {
            p.push(profile[j], y1 * profile[j + 2], z1 * profile[j + 2])
        }
        profiles.push(p)
    }

    const v: number[] = [] 
    for (let i = 0; i < profiles.length; ++i) {
        const prev = profiles[i - 1] 
            ? profiles[i - 1] 
            : profiles[profiles.length - 1]
        const cur = profiles[i]

        for (let j = 3; j < prev.length; j += 3) {
            v.push(
                ...createPolygon(
                    [prev[j - 3], prev[j - 2], prev[j - 1]],
                    [prev[j], prev[j + 1], prev[j + 2]],
                    [cur[j], cur[j + 1], cur[j + 2]],
                    [cur[j - 3], cur[j - 2], cur[j - 1]],
                )
            )
        }
    }

    // const sX = 0
    // const eX = l  
    // const v = [
    //     // bottom
    //     ...createPolygon(
    //         [sX, -W, W],
    //         [eX, -W, W],
    //         [eX, -W, -W],
    //         [sX, -W, -W],
    //     ),
    //     // z-
    //     ...createPolygon(
    //         [sX, -W, -W],
    //         [eX, -W, -W],
    //         [eX, W, -W],
    //         [sX, W, -W],
    //     ),
    //     // z+
    //     ...createPolygon(
    //         [eX, -W, W],
    //         [sX, -W, W],
    //         [sX, W, W],
    //         [eX, W, W],
    //     ),
    //     // top
    //     ...createPolygon(
    //         [sX, W, -W],
    //         [eX, W, -W],
    //         [eX, W, W],
    //         [sX, W, W],
    //     ),
    //     // start cap
    //     ...createPolygon(
    //         [sX, -W, W],
    //         [sX, -W, -W],
    //         [sX, W, -W],
    //         [sX, W, W],
    //     ),
    //     // end cap
    //     ...createPolygon(
    //         [eX, -W, -W],
    //         [eX, -W, W],
    //         [eX, W, W],
    //         [eX, W, -W],
    //     )
    // ]

    // rotate tunnel
    vE.sub(vS)
    vE.normalize()
    const q = new THREE.Quaternion().setFromUnitVectors(defaultDir, vE)
    const m = new THREE.Matrix4().makeRotationFromQuaternion(q)
    applyMatrixToArray(m, v)

    // move tunnel
    const m1 = new THREE.Matrix4().makeTranslation(...v1)
    applyMatrixToArray(m1, v)

    return v
}

const translateVertices = (v: number[], x: number, y: number, z: number): void => {
    const m4 = new THREE.Matrix4().makeTranslation(x, y, z)
    applyMatrixToArray(m4, v)
}

const applyMatrixToArray = (m: THREE.Matrix4, arr: number[]): void => {
    const v3 = new THREE.Vector3()
    for (let i = 0; i < arr.length; i += 3) {
        v3.fromArray(arr, i)
        v3.applyMatrix4(m)
        arr[i] = v3.x
        arr[i + 1] = v3.y
        arr[i + 2] = v3.z
    }
}
