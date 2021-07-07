import { Point } from "./point";
import * as V from "./vector";
import * as U from "./utils";
import * as O from 'fp-ts/Option'

import fp from 'lodash/fp'


export type Line = {
    p: Point,
    angle: number,
    vector: V.Vector,
    vecEquation: VectorEquation
}

export type SlopeEquation = (x: number) => number
export type PolarEquation = (φ: number) => number
export type VectorEquation = (t: number) => V.Vector

export const make = (p: Point, angle: number): Line => {
    const inRad = U.toRad(angle)
    const vector = V.make(
        Math.cos(inRad), 
        Math.sin(inRad)
    )
    return {
        p,
        angle,
        vector,
        vecEquation: vecEquation(p, vector)
    }
}

export const rotate = (angle: number) => (line: Line): Line => make(line.p, line.angle + angle)

export const intersect = (l1: Line) => (l2: Line): O.Option<Point> => {
    // parallel lines 
    if(Math.abs(l1.angle) === Math.abs(l2.angle)) return O.none 

    // find param t for l2 when l1.vecEq === l2.vecEq, thus having a common (intersection) point
    // see more at: https://tinyurl.com/2w2rjrnk
    const t = ((l2.p.y - l1.p.y) * l1.vector.x - (l2.p.x - l1.p.x) * l1.vector.y) / 
        (l2.vector.x * l1.vector.y - l2.vector.y * l1.vector.x)

    const intersection: Point = l2.vecEquation(t)
    return O.some(intersection)
}

const vecEquation = (p: Point, v: V.Vector): VectorEquation => t => fp.flow(
    V.mul(t),
    V.addV(p as V.Vector),
    v => V.make(+v.x.toFixed(2), +v.y.toFixed(2))
)(v)

const slope = (p1: Point, p2: Point): number => (p2.y - p1.y) / ( p2.x - p1.x )
const yIntercept = (p1: Point, m: number): number =>  p1.y - m * p1.x
const calcParams = (p1: Point, p2: Point): { m: number, b: number } => {
    const m = slope(p1, p2)
    const b = yIntercept(p1, m)
    return { m, b }
}
export const slopeEquation = (p1: Point, p2: Point): (axis: "y" | "x") => SlopeEquation => {
    const { m, b } = calcParams(p1, p2)
    return axis => axis === 'y' 
        ? x => m*x + b
        : y => (y-b)/m
}


