import { ClassicTemplate } from './templates/classic'

export const templates: Record<string, typeof ClassicTemplate> = {
    classic: ClassicTemplate,
}

export function getTemplate(name: string) {
    return templates[name] || templates.classic
}
