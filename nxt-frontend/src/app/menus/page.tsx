'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
    fetchMenus,
    fetchMenuTree,
    setCurrentMenu,
    setSelectedItem,
    MenuItem,
} from '@/store/slices/menuSlice'
import { Sidebar } from '@/components/layout/sidebar'
import { MenuTree } from '@/components/menu/menu-tree'
import { ItemDetailsForm } from '@/components/menu/item-details-form'
import { AddItemModal } from '@/components/menu/add-item-modal'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Grid, Expand, ChevronUp } from 'lucide-react'

export default function MenusPage() {
    const dispatch = useAppDispatch()
    const { menus, currentMenu, currentTree, selectedItem, loading, error } =
        useAppSelector((state) => state.menu)

    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedParentId, setSelectedParentId] = useState<string>('')
    const [showMenuSelect, setShowMenuSelect] = useState(false)

    useEffect(() => {
        dispatch(fetchMenus())
    }, [dispatch])

    const handleMenuSelect = (menuSlug: string) => {
        const menu = menus.find((m) => m.slug === menuSlug)
        if (menu) {
            dispatch(setCurrentMenu(menu))
            dispatch(fetchMenuTree(menuSlug))
            setShowMenuSelect(false)
        }
    }

    const handleItemSelect = (item: MenuItem) => {
        dispatch(setSelectedItem(item))
    }

    const handleAddChild = (parentId: string) => {
        setSelectedParentId(parentId)
        setShowAddModal(true)
    }

    const handleExpandAll = () => {
        // Implementation for expanding all tree items
        console.log('Expand all')
    }

    const handleCollapseAll = () => {
        // Implementation for collapsing all tree items
        console.log('Collapse all')
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <Grid className="h-5 w-5 text-gray-600" />
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Menus
                        </h1>
                    </div>

                    {/* Menu Selection */}
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="menu-select">Menu</Label>
                        <div className="relative">
                            <SelectTrigger
                                className="w-64"
                                onClick={() =>
                                    setShowMenuSelect(!showMenuSelect)
                                }
                            >
                                <SelectValue placeholder="Select a menu">
                                    {currentMenu?.name}
                                </SelectValue>
                            </SelectTrigger>
                            {showMenuSelect && (
                                <SelectContent>
                                    {menus.map((menu) => (
                                        <SelectItem
                                            key={menu.id}
                                            value={menu.slug}
                                            onSelect={handleMenuSelect}
                                        >
                                            {menu.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex">
                    {/* Tree Panel */}
                    <div className="w-1/2 bg-white border-r border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Menu Tree</h2>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleExpandAll}
                                    className="flex items-center space-x-1"
                                >
                                    <Expand className="h-4 w-4" />
                                    <span>Expand All</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCollapseAll}
                                    className="flex items-center space-x-1"
                                >
                                    <ChevronUp className="h-4 w-4" />
                                    <span>Collapse All</span>
                                </Button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">Loading...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-500">
                                {error}
                            </div>
                        ) : currentTree ? (
                            <MenuTree
                                items={currentTree.children}
                                onItemSelect={handleItemSelect}
                                onAddChild={handleAddChild}
                                selectedItemId={selectedItem?.id}
                            />
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Select a menu to view its tree
                            </div>
                        )}
                    </div>

                    {/* Details Panel */}
                    <div className="w-1/2 bg-white">
                        <ItemDetailsForm
                            item={selectedItem}
                            menuSlug={currentMenu?.slug || ''}
                        />
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            <AddItemModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                parentId={selectedParentId}
                menuSlug={currentMenu?.slug || ''}
            />
        </div>
    )
}
