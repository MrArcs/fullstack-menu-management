'use client'

import {
    ChevronDown,
    ChevronRight,
    Plus,
    Link,
    Folder,
    Minus,
} from 'lucide-react'
import { MenuItem, MenuTreeProps } from '@/lib/types'
import { useAppDispatch } from '@/lib/hooks'
import { toggleItemExpanded } from '@/store/slices/menuSlice'

export function MenuTree({
    items,
    onItemSelect,
    onAddChild,
    selectedItemId,
}: MenuTreeProps) {
    const dispatch = useAppDispatch()

    const renderItem = (item: MenuItem, level: number = 0) => {
        const hasChildren = item.children && item.children.length > 0
        const isExpanded = item.expanded !== false
        const isSelected = selectedItemId === item.id

        const getItemIcon = (type: string) => {
            switch (type) {
                case 'LINK':
                    return <Link className="h-3 w-3" />
                case 'GROUP':
                    return <Folder className="h-3 w-3" />
                case 'SEPARATOR':
                    return <Minus className="h-3 w-3" />
                default:
                    return <Link className="h-3 w-3" />
            }
        }

        return (
            <div key={item.id} className="select-none">
                <div
                    className={`
            flex items-center space-x-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-100
            ${isSelected ? 'bg-blue-100 border-l-2 border-blue-500' : ''}
          `}
                    style={{ paddingLeft: `${level * 20 + 8}px` }}
                    onClick={() => onItemSelect(item)}
                >
                    {hasChildren ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                dispatch(toggleItemExpanded(item.id))
                            }}
                            className="p-0.5 hover:bg-gray-200 rounded"
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-3 w-3" />
                            ) : (
                                <ChevronRight className="h-3 w-3" />
                            )}
                        </button>
                    ) : (
                        <div className="w-4" />
                    )}

                    {getItemIcon(item.type)}
                    <span className="text-sm flex-1">{item.title}</span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddChild(item.id)
                        }}
                        className="p-1 hover:bg-blue-50 rounded"
                        style={{
                            backgroundColor: '#253BFF',
                            color: 'white',
                        }}
                        title="Add child to lower layer (last position)"
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                </div>

                {hasChildren && isExpanded && (
                    <div>
                        {item.children.map((child) =>
                            renderItem(child, level + 1)
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-1">{items.map((item) => renderItem(item))}</div>
    )
}
