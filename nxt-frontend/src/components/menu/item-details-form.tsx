'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ItemDetailsFormProps } from '@/lib/types'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { updateItem } from '@/store/slices/menuSlice'

const itemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    url: z.string().optional(),
    type: z.enum(['LINK', 'GROUP', 'SEPARATOR']),
})

type ItemFormData = z.infer<typeof itemSchema>

export function ItemDetailsForm({ item, menuSlug }: ItemDetailsFormProps) {
    const dispatch = useAppDispatch()
    const { loading } = useAppSelector((state) => state.menu)
    const [showTypeSelect, setShowTypeSelect] = useState(false)

    const form = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            title: item?.title || '',
            url: item?.url || '',
            type: item?.type || 'LINK',
        },
    })

    const onSubmit = async (data: ItemFormData) => {
        if (!item) return

        try {
            await dispatch(
                updateItem({
                    slug: menuSlug,
                    itemId: item.id,
                    data,
                })
            ).unwrap()
        } catch (error) {
            console.error('Failed to update item:', error)
        }
    }

    if (!item) {
        return (
            <div className="p-6 text-center text-gray-500">
                Select an item to view details
            </div>
        )
    }

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
                        value={item.parentId ? '3' : '1'} // Simplified depth calculation
                        disabled
                        className="bg-gray-50"
                    />
                </div>

                {/* Parent Data (readonly) */}
                <div>
                    <Label htmlFor="parent">Parent Data</Label>
                    <Input
                        id="parent"
                        value={item.parentId || 'Root'}
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

                {/* URL (editable) */}
                <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                        id="url"
                        {...form.register('url')}
                        placeholder="Enter URL (optional)"
                    />
                </div>

                {/* Type (editable) */}
                <div>
                    <Label htmlFor="type">Type</Label>
                    <div className="relative">
                        <SelectTrigger
                            onClick={() => setShowTypeSelect(!showTypeSelect)}
                        >
                            <SelectValue>{form.watch('type')}</SelectValue>
                        </SelectTrigger>
                        {showTypeSelect && (
                            <SelectContent>
                                <SelectItem
                                    value="LINK"
                                    onSelect={(value) => {
                                        form.setValue(
                                            'type',
                                            value as
                                                | 'LINK'
                                                | 'GROUP'
                                                | 'SEPARATOR'
                                        )
                                        setShowTypeSelect(false)
                                    }}
                                >
                                    Link
                                </SelectItem>
                                <SelectItem
                                    value="GROUP"
                                    onSelect={(value) => {
                                        form.setValue(
                                            'type',
                                            value as
                                                | 'LINK'
                                                | 'GROUP'
                                                | 'SEPARATOR'
                                        )
                                        setShowTypeSelect(false)
                                    }}
                                >
                                    Group
                                </SelectItem>
                                <SelectItem
                                    value="SEPARATOR"
                                    onSelect={(value) => {
                                        form.setValue(
                                            'type',
                                            value as
                                                | 'LINK'
                                                | 'GROUP'
                                                | 'SEPARATOR'
                                        )
                                        setShowTypeSelect(false)
                                    }}
                                >
                                    Separator
                                </SelectItem>
                            </SelectContent>
                        )}
                    </div>
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
