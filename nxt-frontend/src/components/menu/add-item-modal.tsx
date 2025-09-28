'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AddItemModalProps } from '@/lib/types'
import { useAppDispatch } from '@/lib/hooks'
import { addItem } from '@/store/slices/menuSlice'
import toast from 'react-hot-toast'

const addItemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    url: z.string().optional(),
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

    const form = useForm<AddItemFormData>({
        resolver: zodResolver(addItemSchema),
        defaultValues: {
            title: '',
            url: '',
        },
    })

    const onSubmit = async (data: AddItemFormData) => {
        setLoading(true)
        const addItemToast = toast.loading('Adding item...')

        try {
            await dispatch(
                addItem({
                    slug: menuSlug,
                    data: {
                        parentId: parentId === 'root' ? null : parentId,
                        ...data,
                        type: 'LINK', // Default to LINK type
                    },
                })
            ).unwrap()
            toast.success('Item added successfully', { id: addItemToast })
            form.reset()
            onClose()
        } catch (error) {
            console.error('Failed to add item:', error)
            toast.error('Failed to add item. Please try again.', {
                id: addItemToast,
            })
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                    {parentId === 'root'
                        ? 'Create Root Menu Item'
                        : 'Add New Item'}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    {parentId === 'root'
                        ? 'This item will be added as a root-level menu item.'
                        : 'This item will be added as the last child in the lower layer.'}
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
