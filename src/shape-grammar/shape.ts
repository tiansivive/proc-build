import F from "@flatten-js/core"


export type Shape<S extends string> = {
    symbol: S,
    position: F.Point,
    polygon: F.Polygon
}

export const create: <S extends string>(symbol: S, position: F.Point, polygon: F.Polygon | Array<F.Point> ) => Shape<S> = (
    symbol,
    position,
    polygon
) => ({
    symbol,
    position,
    polygon:  Array.isArray(polygon) ? new F.Polygon(polygon) : polygon
})
  

export const scope: <S extends string>(s: Shape<S>) => F.Vector = ({
    polygon : { box } 
}) => new F.Vector(
    box.xmax - box.xmin,
    box.ymax - box.ymin
) 


export const print: <S extends string>(s: Shape<S>) => void = s => {
    console.log(`-------------- Shape: ${s.symbol} --------------`)
    console.log(s.position)
    Array.from(s.polygon.edges).forEach((e: F.Edge, i) => {
        console.log(`Edge ${i +1}:`, e.start, e.end)
    })
}

const colors = ['red', 'blue', 'green', 'yellow', 'black', 'cyan', 'orange', 'pink', 'magenta', 'purple', 'grey']

export const draw: (ctx: CanvasRenderingContext2D) => <S extends string>(
    shape: Shape<S>,
    i?: number
  ) => void = ctx => (shape, i) => {

    const color = colors[i || 0]
    const first: F.Edge = Array.from(shape.polygon.edges)[0];
    console.log('\n---------------------')
    console.log('drawing shape', shape)
    console.log('color shape', color)
    console.log('first edge', first)
    console.log('ctx', ctx)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(
        first.start.x + shape.position.x,
        first.start.x + shape.position.y
    );
  
    shape.polygon.edges.forEach((e: F.Edge) => ctx.lineTo(
        shape.position.x + e.end.x,
        shape.position.y + e.end.y
    ));
    ctx.fill();
  };
  
  