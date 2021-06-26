import * as S from './shape'
import F from '@flatten-js/core'

export type Rule<S extends string> = {
    predecessor: S,
    condition: (s: S.Shape<S>) => boolean
    successors: (s: S.Shape<S>) => S.Shape<string>[]
}

export type Axis = 'xx' | 'yy'

export const create: <S extends string>(
    predecessor: S,
    condition: Rule<S>['condition'],
    successors: Rule<S>['successors'] 
) => Rule<S> = (symbol, condition, successors) => ({
    predecessor: symbol,
    condition,
    successors
})


const toRad = (x:number) => x * Math.PI / 180




export const cut: <
    S extends string
>(axis: 'xx' | 'yy', symbols: string[], value: number) =>(s: S.Shape<S>) => S.Shape<string>[] = 
    (axis, symbols, value) =>  s => {

        s.polygon.box.max
            const l = axis === 'xx' 
            ? F.line(F.point(value, 0), F.vector(-1, 0).rotate(toRad(10)))
            : F.line(F.point(0, value), F.vector(0, 1))

            
            const ip = l.intersect(s.polygon);
            const ip_sorted = l.sortPoints(ip);
            const segment = new F.Segment(ip_sorted[0], ip_sorted[1])
            const ml = new F.Multiline([segment]);
            console.log('line', l)
            console.log('ip', ip)
            console.log('ip sorted', ip_sorted)
            console.log('segment', segment)
            console.log('cutting', ml)
            const shapes =  s.polygon.cut(ml).map((p,i) => S.create(symbols[i], s.position, p))
            shapes.forEach(S.print)
       
            return shapes
        }
    
