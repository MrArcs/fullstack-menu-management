export interface MenuResponse {
    id: string
    name: string
    slug: string
    status: 'DRAFT' | 'PUBLISHED'
    createdAt: Date
    updatedAt: Date
}

export interface MenuWithRootResponse extends MenuResponse {
    root: MenuItemNode
}

export interface MenuItemNode {
    id: string
    parentId: string | null
    title: string
    url?: string | null
    type: 'LINK' | 'GROUP' | 'SEPARATOR'
    order: number
    children: MenuItemNode[]
}
