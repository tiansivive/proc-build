import * as P from "./point"
import * as S from 'fp-ts/Show'
import fp from 'lodash/fp'

export type Vector = {
    x: number,
    y: number
}


export const Show: S.Show<Vector> = S.getStructShow<Vector>({
    x: S.showNumber,
    y: S.showNumber
  })
  

export const make = (x: number, y: number): Vector => ({ x, y })

export const add = (k: number) => (v: Vector): Vector => ({ x: v.x + k, y: v.y + k })
export const sub = (k: number) => (v: Vector): Vector => ({ x: v.x - k, y: v.y - k })
export const mul = (k: number) => (v: Vector): Vector => ({ x: v.x * k, y: v.y * k })
export const div = (k: number) => (v: Vector): Vector => ({ x: v.x / k, y: v.y / k })


export const addV = (u: Vector) => (v: Vector): Vector => ({ x: v.x + u.x, y: v.y + u.y })
export const subV = (u: Vector) => (v: Vector): Vector => ({ x: v.x - u.x, y: v.y - u.y })


export const rotate = (angle: number) => (v: Vector): Vector => ({
    x: Math.cos(angle) * v.x - Math.sin(angle) * v.y,
    y: Math.sin(angle) * v.x - Math.cos(angle) * v.y
})

export const magnitude = P.distance
export const calcUnit = (p1: P.Point, p2: P.Point): Vector => {
    const m = magnitude(p1)(p2)
    return fp.flow(
        subV(p1),
        mul(1/m)
    )(p2)

}
