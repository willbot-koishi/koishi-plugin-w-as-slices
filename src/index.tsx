import { Context, Fragment, Session, h, z } from 'koishi'

export const name = 'w-as-slices'

export interface Config {}

export const Config: z<Config> = z.object({})

interface AsSlicesAttr {
    header: Fragment
    sliceLength: number
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'as-slices': AsSlicesAttr & { children?: any[] }
        }
    }
}

export function apply(ctx: Context) {
    const renderAsSlices = ({ header, sliceLength }: AsSlicesAttr, children: h[], _session: Session): h => {
        const [ slices ] = [ header?.toString() ?? '', ...children ].reduce<[ string[], string ]>(
            ([ slices, currentSlice ], text, index, { length }) => {
                const appendedSlice = currentSlice + text
                if (appendedSlice.length >= sliceLength || index === length - 1) {
                    slices.push(appendedSlice)
                    return [ slices, '' ]
                }
                return [ slices, appendedSlice ]
            },
            [ [], '' ]
        )
        return <>{ slices.map(slice => <message>{ h.parse(slice) }</message>) }</>
    }

    ctx.component('as-slices', renderAsSlices)
}
