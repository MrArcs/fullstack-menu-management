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
import { AddItemModalProps } from '@/lib/types'
import { useAppDispatch } from '@/lib/hooks'
import { addItem } from '@/store/slices/menuSlice'

const addItemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    url: z.string().optional(),
    type: z.enum(['LINK', 'GROUP', 'SEPARATOR']),
})

type AddItemFormData = z.infer<typeof addItemSchema>

export function AddItemModal({
    isOpen,
    onClose,
    parentId,
    menuSlug,
}: AddItemModalProps) {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [showTypeSelect, setShowTypeSelect] = useState(false)

    const form = useForm<AddItemFormData>({
        resolver: zodResolver(addItemSchema),
        defaultValues: {
            title: '',
            url: '',
            type: 'LINK',
        },
    })

    const onSubmit = async (data: AddItemFormData) => {
        setLoading(true)
        try {
            await dispatch(
                addItem({
                    slug: menuSlug,
                    data: {
                        parentId,
                        ...data,
                    },
                })
            ).unwrap()
            form.reset()
            onClose()
        } catch (error) {
            console.error('Failed to add item:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
                <p className="text-sm text-gray-600 mb-4">
                    This item will be added as the last child in the lower
                    layer.
                </p>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            {...form.register('title')}
                            placeholder="Enter item title"
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="url">URL (optional)</Label>
                        <Input
                            id="url"
                            {...form.register('url')}
                            placeholder="Enter URL"
                        />
                    </div>

                    <div>
                        <Label htmlFor="type">Type</Label>
                        <div className="relative">
                            <SelectTrigger
                                onClick={() =>
                                    setShowTypeSelect(!showTypeSelect)
                                }
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

                    <div className="flex space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            style={{
                                backgroundColor: '#253BFF',
                                color: 'white',
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Item'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
