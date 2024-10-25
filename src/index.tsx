import { Context, Fragment, Session, h, z } from 'koishi'

export const name = 'w-as-slices'

export interface Config {}

export const Config: z<Config> = z.object({})

interface AsForwardAttr {
    header: Fragment
    sliceLength: number
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'as-slices': AsForwardAttr & { children?: any[] }
        }
    }
}

export function apply(ctx: Context, _config: Config) {
    const renderAsSlices = ({ header, sliceLength }: AsForwardAttr, children: h[], _session: Session): h => {
        const [ slices ] = children.reduce<[ string[], string ]>(([ slices, currentSlice ], text, index) => {
            const appendedSlice = currentSlice + text
            if (appendedSlice.length >= sliceLength || index === children.length - 1) {
                slices.push(appendedSlice)
                return [ slices, '' ]
            }
            return [ slices, appendedSlice ]
        }, [ [], header?.toString() ?? '' ])
        return <>{ slices.map(slice => <message>{ h.parse(slice) }</message>) }</>
    }

    ctx.component('as-slices', renderAsSlices)
}
