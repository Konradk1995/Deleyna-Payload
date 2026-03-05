import type { ArrayField, Field } from 'payload'
import type { LinkAppearance } from './link'
import deepMerge from '@/utilities/deepMerge'
import { link } from './link'

type LinkGroupType = (options?: {
    appearances?: LinkAppearance[] | false
    overrides?: Partial<ArrayField>
}) => Field

export const linkGroup: LinkGroupType = ({ appearances, overrides = {} } = {}) => {
    const generatedLinkGroup: Field = {
        name: 'links',
        type: 'array',
        fields: [
            link({
                appearances,
            }),
        ],
        admin: {
            initCollapsed: true,
        },
    }

    return deepMerge(
        generatedLinkGroup as Record<string, unknown>,
        overrides as Record<string, unknown>,
    ) as Field
}
