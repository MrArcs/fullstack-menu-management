export interface Menu {
    id: string
    name: string
    slug: string
    status: 'DRAFT' | 'PUBLISHED'
    createdAt: string
    updatedAt: string
}

export interface MenuItem {
    id: string
    parentId: string | null
    title: string
    url?: string | null
    type: 'LINK' | 'GROUP' | 'SEPARATOR'
    order: number
    children: MenuItem[]
    expanded?: boolean // For tree view state
}

export interface CreateMenuRequest {
    name: string
    slug: string
}

export interface CreateItemRequest {
    parentId: string
    title: string
    url?: string
    type?: 'LINK' | 'GROUP' | 'SEPARATOR'
}

export interface UpdateItemRequest {
    title?: string
    url?: string
    type?: 'LINK' | 'GROUP' | 'SEPARATOR'
    parentId?: string
    order?: number
}

export interface UpdateMenuRequest {
    name?: string
    status?: 'DRAFT' | 'PUBLISHED'
}

export interface SaveMenuRequest {
    action: 'PUBLISH' | 'SAVE'
}

// Component Props Types
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export interface SelectProps {
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
    placeholder?: string
    disabled?: boolean
    className?: string
}

export interface SelectTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    placeholder?: string
}

export interface SelectValueProps {
    placeholder?: string
    children?: React.ReactNode
}

export interface SelectContentProps
    extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export interface SelectItemProps {
    value: string
    children: React.ReactNode
    onSelect?: (value: string) => void
    className?: string
    disabled?: boolean
    tabIndex?: number
    id?: string
    style?: React.CSSProperties
    title?: string
    role?: string
    'aria-label'?: string
    'aria-selected'?: boolean
    'aria-disabled'?: boolean
}

export interface SidebarProps {
    className?: string
}

export interface MenuTreeProps {
    items: MenuItem[]
    onItemSelect: (item: MenuItem) => void
    onAddChild: (parentId: string) => void
    selectedItemId?: string
}

export interface ItemDetailsFormProps {
    item: MenuItem | null
    menuSlug: string
}

export interface AddItemModalProps {
    isOpen: boolean
    onClose: () => void
    parentId: string
    menuSlug: string
}
