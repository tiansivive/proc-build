import * as P from '../geometry/point'
import * as V from '../geometry/vector'
import * as PL from '../geometry/polygon'

import * as S from 'fp-ts/Show'

import fp from 'lodash/fp'

export type Shape<S extends string> = {
    symbol: S,
    position: P.Point,
    scale: V.Vector,
    polygon: PL.Polygon
}


export const Show: S.Show<Shape<string>> = {
    show: shape => `\nShape ${shape.symbol} @ ${P.Show.show(shape.position)}\n`
        + PL.Show.show(shape.polygon)
        
}
  


export const make: <S extends string>(symbol: S, polygon: PL.Polygon, position?: P.Point, scale?: V.Vector ) => Shape<S> = (
    symbol,
    polygon,
    position = { x: 0, y: 0 },
    scale = { x: 1, y: 1 },
) => ({
    symbol,
    polygon,
    position,
    scale
})
  



// export const scope: <S extends string>(s: Shape<S>) => V.Vector = ({
//     polygon : { box } 
// }) => V.make(
//     box.xmax - box.xmin,
//     box.ymax - box.ymin
// ) 


export const draw: (ctx: CanvasRenderingContext2D) => <S extends string>(
    shape: Shape<S>,
    color?: string
  ) => void = ctx => (shape, color = 'red') => {

    const scaled = fp.flow(
        fp.map<P.Point, P.Point>(v =>  ({ x: v.x * shape.scale.x, y: v.y * shape.scale.y  })),
        PL.make
    )(shape.polygon.vertices)
    PL.draw(ctx)(scaled, color, shape.position)
   
  };
  
  