

// import _ from 'lodash'
import * as Pl from './geometry/polygon'
// import * as Pt from './geometry/point'
import * as L from './geometry/line'
import * as Colors from './graphics/colors'

import fp from 'lodash/fp'


const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 1200;
canvas.height = 600;

const ctx = canvas.getContext("2d");



const polygon = Pl.make([
  {x: 0, y: 50},
  {x: 100, y: 0},
  {x: 300, y: 0},
  {x: 400, y: 50},
  {x: 400, y: 250},
  {x: 300, y: 300},
  {x: 100, y: 300},
  {x: 0, y: 250}
])

// const s = S.create('S', new F.Point(10,10), new F.Polygon([
//   F.point(0, 0),
//   F.point(100, 0),
//   // F.point(100, 20),
//   // F.point(20, 20),
//   // F.point(20, 40),
//   // F.point(100, 40),
//   // F.point(100, 60),
//   // F.point(20, 60),
//   // F.point(20, 80),
//   // F.point(100, 80),
//   F.point(100, 100),
//   F.point(0, 100)
// ]));

// const shapes = R.cut('xx', ['S1', 'S2'], 50)(s)

// const draw: (shapes: S.Shape<string>[]) => void = shapes => _.each(shapes, S.draw(ctx))

console.log('poly', polygon)
console.log(Pl.Show.show(polygon))

const cuts = fp.range(1, 10).map(n => L.make({ x: n * 40, y: 0 }, 90))
const cut = L.make({ x: 200, y: 0 }, 90)
//const polys = Pl.cut(cut)(polygon)


const polys = Pl.divide(cuts)(polygon)

polys.forEach((p, i) => {
  console.log('drawing', i, p)
  console.log('cut:',  cuts[i])
  console.log(Pl.Show.show(p))
  Pl.draw(ctx)(p, Colors.next(i))
})


// draw(shapes)

// draw([s])