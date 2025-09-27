import { MenuItemNode } from './menu.entity'

export function buildTree(
    items: Omit<MenuItemNode, 'children'>[]
): MenuItemNode {
    const byParent: Record<string, MenuItemNode[]> = {}
    const roots = items.filter((i) => i.parentId === null)
    if (roots.length !== 1)
        throw new Error('Menu must have exactly one root item.')
    const root = { ...roots[0], children: [] as MenuItemNode[] }
    items
        .filter((i) => i.parentId !== null)
        .forEach((i) => {
            const key = i.parentId as string
            ;(byParent[key] ||= []).push({ ...i, children: [] })
        })
    const attach = (node: MenuItemNode) => {
        const kids = byParent[node.id] || []
        kids.sort((a, b) => a.order - b.order)
        node.children = kids
        kids.forEach(attach)
    }
    attach(root)
    return root
}
