
import * as E from 'fp-ts/Eq'
import * as S from 'fp-ts/Show'

import * as V from './vector'


import _ from 'lodash'


export type Point = {
    x: number,
    y: number,
}





export const Show: S.Show<Point> = S.getStructShow<Point>({
  x: S.showNumber,
  y: S.showNumber
})



export const Eq: E.Eq<Point> = {
  equals: _.isEqual
}

export const make = (x: number,y: number): Point => ({ x, y })
export const distance = (p1: Point) => (p2: Point): number => Math.sqrt(
    Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
)


