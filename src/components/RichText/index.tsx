import { type DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/utilities/ui'

type Props = {
    data: DefaultTypedEditorState
    enableGutter?: boolean
    enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const EMPTY_EDITOR_STATE: DefaultTypedEditorState = {
    root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [],
        direction: null,
    },
}

function isValidEditorState(data: unknown): data is DefaultTypedEditorState {
    if (!data || typeof data !== 'object') return false
    const candidate = data as { root?: { children?: unknown; type?: unknown } }
    return (
        Boolean(candidate.root) &&
        typeof candidate.root?.type === 'string' &&
        Array.isArray(candidate.root?.children)
    )
}

export default function RichText(props: Props) {
    const { className, enableProse = true, enableGutter = true, data, ...rest } = props
    const safeData = isValidEditorState(data) ? data : EMPTY_EDITOR_STATE

    return (
        <ConvertRichText
            data={safeData}
            className={cn(
                'payload-richtext',
                {
                    'container': enableGutter,
                    'max-w-none': !enableGutter,
                    'prose md:prose-md dark:prose-invert': enableProse,
                },
                className,
            )}
            {...rest}
        />
    )
}

export { RichText }
