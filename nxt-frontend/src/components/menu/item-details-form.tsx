'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ItemDetailsFormProps } from '@/lib/types'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { updateItem, MenuItem } from '@/store/slices/menuSlice'
import toast from 'react-hot-toast'

const itemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
})

type ItemFormData = z.infer<typeof itemSchema>

export function ItemDetailsForm({ item, menuSlug }: ItemDetailsFormProps) {
    const dispatch = useAppDispatch()
    const { loading, currentTree } = useAppSelector((state) => state.menu)

    const form = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            title: item?.title || '',
        },
    })

    // Update form when item changes
    React.useEffect(() => {
        if (item) {
            form.reset({
                title: item.title,
            })
        }
    }, [item, form])

    // Calculate the actual depth of the item
    const calculateItemDepth = (
        itemId: string,
        tree: MenuItem | null,
        depth = 0
    ): number => {
        if (!tree || !tree.children) return -1

        for (const child of tree.children) {
            if (child.id === itemId) {
                return depth
            }
            if (child.children && child.children.length > 0) {
                const foundDepth = calculateItemDepth(itemId, child, depth + 1)
                if (foundDepth >= 0) {
                    return foundDepth
                }
            }
        }
        return -1
    }

    // Get parent name
    const getParentName = (
        parentId: string | null,
        tree: MenuItem | null
    ): string => {
        if (!parentId || !tree) return 'Root'

        const findParent = (
            items: MenuItem[],
            targetId: string
        ): MenuItem | null => {
            for (const item of items) {
                if (item.id === targetId) return item
                if (item.children) {
                    const found = findParent(item.children, targetId)
                    if (found) return found
                }
            }
            return null
        }

        const parent = findParent(tree.children || [], parentId)
        return parent ? parent.title : 'Root'
    }

    const onSubmit = async (data: ItemFormData) => {
        if (!item) return

        const updateToast = toast.loading('Updating item...')

        try {
            await dispatch(
                updateItem({
                    slug: menuSlug,
                    itemId: item.id,
                    data: {
                        ...data,
                        type: 'LINK', // Keep existing type
                    },
                })
            ).unwrap()
            toast.success('Item updated successfully', { id: updateToast })
        } catch (error) {
            console.error('Failed to update item:', error)
            toast.error('Failed to update item. Please try again.', {
                id: updateToast,
            })
        }
    }

    if (!item) {
        return (
            <div className="p-6 text-center text-gray-500">
                Select an item to view details
            </div>
        )
    }

    const itemDepth = calculateItemDepth(item.id, currentTree)
    const parentName = getParentName(item.parentId, currentTree)

    return (
        <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Item Details</h3>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Menu ID (readonly) */}
                <div>
                    <Label htmlFor="menuId">Menu ID</Label>
                    <Input
                        id="menuId"
                        value={item.id}
                        disabled
                        className="bg-gray-50"
                    />
                </div>

                {/* Depth (readonly) */}
                <div>
                    <Label htmlFor="depth">Depth</Label>
                    <Input
                        id="depth"
                        value={itemDepth.toString()}
                        disabled
                        className="bg-gray-50"
                    />
                </div>

                {/* Parent Data (readonly) */}
                <div>
                    <Label htmlFor="parent">Parent Data</Label>
                    <Input
                        id="parent"
                        value={parentName}
                        disabled
                        className="bg-gray-50"
                    />
                </div>

                {/* Name (editable) */}
                <div>
                    <Label htmlFor="title">Name</Label>
                    <Input
                        id="title"
                        {...form.register('title')}
                        placeholder="Enter item name"
                    />
                    {form.formState.errors.title && (
                        <p className="text-sm text-red-500 mt-1">
                            {form.formState.errors.title.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    style={{
                        backgroundColor: '#253BFF',
                        color: 'white',
                    }}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </form>
        </div>
    )
}
