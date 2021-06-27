import fp from 'lodash/fp'

import * as P from "./point";
import * as V from "./vector";
import * as LS from "./segment";
import * as L from "./line";

import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/Show'



export type Polygon = {
    vertices: Array<P.Point>,
    edges: Array<LS.LineSegment>
}

export const Show: S.Show<Polygon> = {
    show: poly => poly.edges.map(LS.Show.show).join('\n')
}
  


export const make = (vertices: Array<P.Point>): Polygon => ({ 
    vertices,
    edges: fp.zipWith(
        LS.makeFromPoints, vertices, fp.concat(
            fp.tail(vertices),
            fp.head(vertices)
        )
    )
})

const recurse = (index: number, segments: LS.LineSegment[]) => (intersection: P.Point[]): LS.LineSegment[] => {

    if(index === intersection.length) return segments
    if(index < 1) return recurse(index +1, segments)(intersection)

    return recurse(index + 1, fp.concat(
        segments,
        LS.makeFromPoints(intersection[index -1], intersection[index])
    ))(intersection)

}

const makeIntersectionSegments: (intersection: O.Option<P.Point>[]) => LS.LineSegment[] = fp.flow(
    fp.map(O.toUndefined),
    fp.remove(fp.isUndefined),
    recurse(0, [])
)

const makeNewSegments: (poly: Polygon) => (intersection: O.Option<P.Point>[]) => LS.LineSegment[] = poly => intersection => fp.flow(
    fp.zipWith((e, ie: O.Option<P.Point>) => O.isNone(ie)
        ? [e]
        : [
            LS.makeFromPoints(e.pivot, ie.value),
            LS.makeFromPoints(ie.value, e.end)
        ]
        , poly.edges), 
    fp.flatten,
    fp.concat(
        makeIntersectionSegments(intersection)
    )
)(intersection)




const fromEdges = (edges: LS.LineSegment[]): Polygon => ({
    edges,
    vertices: fp.flow(
        fp.flatMap((e: LS.LineSegment) => [e.pivot, e.end]),
        fp.uniqWith(fp.isEqual)
    )(edges)
}) 

export const cut = (l: L.Line) => (poly: Polygon): Polygon[] => {
    
    const intersection = poly.edges.map(LS.intersect(l))
    const allSegments = makeNewSegments(poly)(intersection)

    const min = intersection.reduce((min, point) => O.isNone(point) ? min : Math.min(min, point.value.x) , Number.POSITIVE_INFINITY)
    const max = intersection.reduce((max, point) => O.isNone(point) ? max : Math.max(max, point.value.x) , Number.NEGATIVE_INFINITY)
    
    return [
        allSegments.filter(ls => ls.pivot.x <= max && ls.end.x <= max),
        allSegments.filter(ls => ls.pivot.x >= min && ls.end.x >= min)
    ].map(fp.flow(
        fromEdges,
        sortClockWise 
    ))
} 


export const divide = (cuts: L.Line[]) => (poly: Polygon): Polygon[] => cuts.reduce(
    (polys, cutLine) => fp.flow(
        fp.last,
        cut(cutLine), 
        fp.concat(fp.initial(polys))
    )(polys)
    , [poly]
)

export const calculateCentroid = (poly: Polygon): P.Point => fp.flow(
    fp.reduce<V.Vector, P.Point>((sum, v) => V.addV(sum)(v),  { x: 0, y: 0 }),
    V.div(poly.vertices.length)
)(poly.vertices)

export const sortClockWise = (poly: Polygon): Polygon => {
    const centroid = calculateCentroid(poly)

    return fp.flow(
        fp.map<P.Point, [P.Point, LS.LineSegment]>(p => [p, LS.makeFromPoints(centroid, p)]),
        fp.sortBy([([, ls]) => ls.angle, ([, ls]) => ls.length]),
       
        pairs => {
            pairs.forEach(([p, ls]) => console.log(P.Show.show(p) + ":", ls.angle, ls.length))
            return pairs
        },
        fp.map(fp.first),
        make
    )(poly.vertices)

}


export const draw: (ctx: CanvasRenderingContext2D) => (
    poly: Polygon,
    color?: string
  ) => void = ctx => (poly, color = 'red') => {

    
    const first = poly.edges[0]

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(
        first.pivot.x,
        first.pivot.y
    );
  
    poly.edges.forEach(e => ctx.lineTo(
        e.end.x,
        e.end.y
    ));
    ctx.fill();
  };
  

