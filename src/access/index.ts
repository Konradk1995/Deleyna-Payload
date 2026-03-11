import type { Access, FieldAccess } from 'payload'

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const adminOnly: Access = ({ req: { user } }) => {
    return Boolean(user?.roles?.includes('admin'))
}

export const adminOrEditor: Access = ({ req: { user } }) => {
    if (!user) return false
    return user.roles?.includes('admin') || user.roles?.includes('editor')
}

export const adminOrSelf: Access = ({ req: { user } }) => {
    if (!user) return false
    if (user.roles?.includes('admin')) return true
    return { id: { equals: user.id } }
}

export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
    if (user) return true
    return { _status: { equals: 'published' } }
}

export const adminFieldAccess: FieldAccess = ({ req: { user } }) => {
    return Boolean(user?.roles?.includes('admin'))
}

export const editorFieldAccess: FieldAccess = ({ req: { user } }) => {
    if (!user) return false
    return user.roles?.includes('admin') || user.roles?.includes('editor')
}
