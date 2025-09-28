import { MenuItemNode } from './menu.entity'

export function buildTree(
    items: Omit<MenuItemNode, 'children'>[]
): MenuItemNode {
    const byParent: Record<string, MenuItemNode[]> = {}
    const roots = items.filter((i) => i.parentId === null)

    // Create a virtual root node that contains all root items
    const virtualRoot: MenuItemNode = {
        id: 'virtual-root',
        parentId: null,
        title: 'Root',
        url: null,
        type: 'GROUP',
        order: 0,
        children: [],
    }

    // Sort root items by order
    roots.sort((a, b) => a.order - b.order)
    virtualRoot.children = roots.map((root) => ({ ...root, children: [] }))

    // Handle child items
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

    // Attach children to all nodes
    const attachToAll = (nodes: MenuItemNode[]) => {
        nodes.forEach((node) => {
            attach(node)
            if (node.children.length > 0) {
                attachToAll(node.children)
            }
        })
    }

    attachToAll(virtualRoot.children)
    return virtualRoot
}
