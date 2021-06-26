import * as S from 'fp-ts/Show'


import * as P from "./point";
import * as L from "./line";
import * as V from "./vector";
import * as U from "./utils";


import fp from "lodash/fp";

export type LineSegment = L.Line & {
    pivot: P.Point,
    end: P.Point,
    length: number,
    max: {
        x: number,
        y: number
    },
    min: {
        x: number,
        y: number
    }
}

export const Show: S.Show<LineSegment> = {
    show: ls => P.Show.show(ls.p) + ' -> ' + P.Show.show(ls.end)
}
  

export const make = (length: number) => (pivot: P.Point, angle: number): LineSegment => {

    const line = L.make(pivot, angle)
    const end: P.Point = line.vecEquation(length)

    return fp.defaults({
            pivot,
            end,
            length,
            max: {
                x: Math.max(pivot.x, end.x),
                y: Math.max(pivot.y, end.y),
            },
            min: {
                x: Math.min(pivot.x, end.x),
                y: Math.min(pivot.y, end.y),
            },
        }, line) as LineSegment
}

export const makeFromPoints = (p1: P.Point, p2: P.Point): LineSegment => {
    const l = P.distance(p1)(p2)
    const v = V.calcUnit(p1, p2)
    const angle = Math.atan2(v.y, v.x)

    return make(l)(p1, U.fromRad(angle))
}
export const toLine = (segment: LineSegment): L.Line => L.make(segment.pivot, segment.angle)
export const fromLine = (length: number) => (l: L.Line): LineSegment => make(length)(l.p, l.angle)

export const rotate = (angle: number) => (segment: LineSegment): LineSegment => make(segment.length)(segment.pivot, segment.angle + angle)

