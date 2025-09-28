'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch } from '@/lib/hooks'
import { createMenu } from '@/store/slices/menuSlice'
import toast from 'react-hot-toast'

const createMenuSchema = z.object({
    name: z.string().min(1, 'Menu name is required'),
    slug: z.string().min(1, 'Menu slug is required'),
})

type CreateMenuFormData = z.infer<typeof createMenuSchema>

interface CreateMenuModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CreateMenuModal({ isOpen, onClose }: CreateMenuModalProps) {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)

    const form = useForm<CreateMenuFormData>({
        resolver: zodResolver(createMenuSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    })

    const onSubmit = async (data: CreateMenuFormData) => {
        setLoading(true)
        const createMenuToast = toast.loading('Creating menu...')

        try {
            await dispatch(createMenu(data)).unwrap()
            toast.success('Menu created successfully', { id: createMenuToast })
            form.reset()
            onClose()
        } catch (error) {
            console.error('Failed to create menu:', error)
            toast.error('Failed to create menu. Please try again.', {
                id: createMenuToast,
            })
        } finally {
            setLoading(false)
        }
    }

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        form.setValue('slug', slug)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                <h2 className="text-lg font-semibold mb-4">Create New Menu</h2>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div>
                        <Label htmlFor="name">Menu Name</Label>
                        <Input
                            id="name"
                            {...form.register('name')}
                            onChange={(e) => {
                                form.register('name').onChange(e)
                                handleNameChange(e)
                            }}
                            placeholder="Enter menu name"
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="slug">Menu Slug</Label>
                        <Input
                            id="slug"
                            {...form.register('slug')}
                            placeholder="Enter menu slug"
                        />
                        {form.formState.errors.slug && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.slug.message}
                            </p>
                        )}
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
                            {loading ? 'Creating...' : 'Create Menu'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
