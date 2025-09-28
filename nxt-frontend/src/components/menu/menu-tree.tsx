'use client'

import {
    ChevronDown,
    ChevronRight,
    Plus,
    Folder,
    Trash2,
    File,
} from 'lucide-react'
import { MenuItem, MenuTreeProps } from '@/lib/types'
import { useAppDispatch } from '@/lib/hooks'
import { toggleItemExpanded, deleteItem } from '@/store/slices/menuSlice'
import toast from 'react-hot-toast'

export function MenuTree({
    items,
    onItemSelect,
    onAddChild,
    selectedItemId,
    menuSlug,
}: MenuTreeProps) {
    const dispatch = useAppDispatch()

    const calculateItemDepth = (
        itemId: string,
        items: MenuItem[],
        currentDepth: number = 0
    ): number => {
        for (const item of items) {
            if (item.id === itemId) {
                return currentDepth
            }
            if (item.children && item.children.length > 0) {
                const foundDepth = calculateItemDepth(
                    itemId,
                    item.children,
                    currentDepth + 1
                )
                if (foundDepth >= 0) {
                    return foundDepth
                }
            }
        }
        return -1
    }

    const canAddChild = (item: MenuItem): boolean => {
        const itemDepth = calculateItemDepth(item.id, items)
        return itemDepth < 3 // Allow up to depth 3 (0, 1, 2, 3) = 4 levels total
    }

    const handleDeleteItem = async (itemId: string, itemTitle: string) => {
        // Show confirmation toast
        toast(
            (t) => (
                <div className="flex flex-col space-y-2">
                    <div className="font-semibold">Confirm Delete</div>
                    <div className="text-sm">
                        Are you sure you want to delete &quot;{itemTitle}&quot;?
                        This action cannot be undone.
                    </div>
                    <div className="flex space-x-2 mt-2">
                        <button
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            onClick={() => {
                                toast.dismiss(t.id)
                                executeDeleteItem(itemId)
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
                id: 'delete-item-confirmation',
                position: 'bottom-center',
            }
        )
    }

    const executeDeleteItem = async (itemId: string) => {
        const deleteItemToast = toast.loading('Deleting item...')

        try {
            await dispatch(deleteItem({ slug: menuSlug, itemId })).unwrap()
            toast.success('Item deleted successfully', { id: deleteItemToast })
        } catch (error) {
            console.error('Failed to delete item:', error)
            toast.error('Failed to delete item. Please try again.', {
                id: deleteItemToast,
            })
        }
    }

    const renderItem = (item: MenuItem, level: number = 0) => {
        const hasChildren = item.children && item.children.length > 0
        const isExpanded = item.expanded !== false
        const isSelected = selectedItemId === item.id

        const getItemIcon = (item: MenuItem) => {
            // Check if item has children
            const hasChildren = item.children && item.children.length > 0

            if (hasChildren) {
                return <Folder className="h-3 w-3" />
            } else {
                return <File className="h-3 w-3" />
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

                    {getItemIcon(item)}
                    <span className="text-sm flex-1">{item.title}</span>

                    <div className="flex space-x-1">
                        {canAddChild(item) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onAddChild(item.id)
                                }}
                                className="p-1 rounded hover:bg-blue-50"
                                style={{
                                    backgroundColor: '#253BFF',
                                    color: 'white',
                                }}
                                title="Add child to lower layer (last position)"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteItem(item.id, item.title)
                            }}
                            className="p-1 hover:bg-red-50 rounded text-red-600 hover:text-red-700"
                            title="Delete item"
                        >
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
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

    // Add safety check for items
    if (!items || !Array.isArray(items)) {
        return (
            <div className="text-center py-8 text-gray-500">
                No items available
            </div>
        )
    }

    return (
        <div className="space-y-1">{items.map((item) => renderItem(item))}</div>
    )
}
