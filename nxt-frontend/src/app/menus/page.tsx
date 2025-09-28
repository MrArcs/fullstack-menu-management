'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import toast from 'react-hot-toast'
import {
    fetchMenus,
    fetchMenuTree,
    setCurrentMenu,
    setSelectedItem,
    deleteMenu,
    expandAllItems,
    collapseAllItems,
    MenuItem,
} from '@/store/slices/menuSlice'
import { Sidebar } from '@/components/layout/sidebar'
import { MenuTree } from '@/components/menu/menu-tree'
import { ItemDetailsForm } from '@/components/menu/item-details-form'
import { AddItemModal } from '@/components/menu/add-item-modal'
import { CreateMenuModal } from '@/components/menu/create-menu-modal'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Grid, Expand, ChevronUp, Trash2, Plus } from 'lucide-react'

export default function MenusPage() {
    const dispatch = useAppDispatch()
    const { menus, currentMenu, currentTree, selectedItem, loading, error } =
        useAppSelector((state) => state.menu)

    console.log('MenusPage: Current state:', {
        menus,
        currentMenu,
        currentTree,
        selectedItem,
        loading,
        error,
    })

    // Debug menus array
    console.log('MenusPage: Menus array details:', {
        isArray: Array.isArray(menus),
        length: menus?.length,
        firstMenu: menus?.[0],
        allMenus: menus,
    })

    // Auto-select first menu if available and no current menu
    useEffect(() => {
        if (menus.length > 0 && !currentMenu && !loading) {
            const firstMenu = menus.find(
                (menu) => menu && typeof menu === 'object' && menu.slug
            ) // Find first menu with valid slug
            if (firstMenu && firstMenu.slug) {
                console.log('MenusPage: Auto-selecting first menu:', firstMenu)
                dispatch(setCurrentMenu(firstMenu))
                dispatch(fetchMenuTree(firstMenu.slug))
            }
        }
    }, [menus, currentMenu, loading, dispatch])

    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedParentId, setSelectedParentId] = useState<string>('')
    const [showCreateMenuModal, setShowCreateMenuModal] = useState(false)

    useEffect(() => {
        console.log('MenusPage: useEffect triggered, dispatching fetchMenus')
        dispatch(fetchMenus()).catch((error) => {
            console.error('Failed to fetch menus:', error)
        })
    }, [dispatch])

    const handleMenuSelect = (menuSlug: string) => {
        console.log('MenusPage: handleMenuSelect called with slug:', menuSlug)
        if (!menuSlug) return // Don't process empty slug
        const menu = menus.find((m) => m.slug === menuSlug)
        console.log('MenusPage: Found menu:', menu)
        if (menu && menu.slug) {
            console.log('MenusPage: Setting current menu and fetching tree')
            dispatch(setCurrentMenu(menu))
            dispatch(fetchMenuTree(menuSlug))
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
        dispatch(expandAllItems())
    }

    const handleCollapseAll = () => {
        dispatch(collapseAllItems())
    }

    const handleDeleteMenu = async () => {
        if (!currentMenu) return

        // Show confirmation toast
        toast(
            (t) => (
                <div className="flex flex-col space-y-2">
                    <div className="font-semibold">Confirm Delete!!</div>
                    <div className="text-sm">
                        Are you sure you want to delete &quot;{currentMenu.name}
                        &quot;? This action cannot be undone.
                    </div>
                    <div className="flex space-x-2 mt-2">
                        <button
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            onClick={() => {
                                toast.dismiss(t.id)
                                executeDelete()
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
                id: 'delete-confirmation',
                position: 'top-center',
            }
        )
    }

    const executeDelete = async () => {
        if (!currentMenu) return

        const deleteMenuToast = toast.loading('Deleting menu...')

        try {
            await dispatch(deleteMenu(currentMenu.slug)).unwrap()
            toast.success(`Menu "${currentMenu.name}" deleted successfully`, {
                id: deleteMenuToast,
            })
        } catch (error) {
            console.error('Failed to delete menu:', error)
            toast.error('Failed to delete menu. Please try again.', {
                id: deleteMenuToast,
            })
        }
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
                            <select
                                id="menu-select"
                                className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={currentMenu?.slug || ''}
                                onChange={(e) =>
                                    handleMenuSelect(e.target.value)
                                }
                            >
                                <option value="">Select a menu</option>
                                {menus &&
                                Array.isArray(menus) &&
                                menus.length > 0
                                    ? menus
                                          .filter(
                                              (menu) =>
                                                  menu &&
                                                  typeof menu === 'object' &&
                                                  menu.id &&
                                                  menu.slug &&
                                                  menu.name
                                          )
                                          .map((menu) => (
                                              <option
                                                  key={menu.id}
                                                  value={menu.slug}
                                              >
                                                  {menu.name}
                                              </option>
                                          ))
                                    : null}
                                {menus &&
                                    Array.isArray(menus) &&
                                    menus.length === 0 && (
                                        <option value="" disabled>
                                            No menus available
                                        </option>
                                    )}
                            </select>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCreateMenuModal(true)}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-700 hover:bg-green-50 bg-green-100 border border-green-300 cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Menu</span>
                        </Button>
                        {currentMenu && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDeleteMenu}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 bg-red-100 border border-red-300 cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete Menu</span>
                            </Button>
                        )}
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
                                items={currentTree.children || []}
                                onItemSelect={handleItemSelect}
                                onAddChild={handleAddChild}
                                selectedItemId={selectedItem?.id}
                                menuSlug={currentMenu?.slug || ''}
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

            {/* Create Menu Modal */}
            <CreateMenuModal
                isOpen={showCreateMenuModal}
                onClose={() => setShowCreateMenuModal(false)}
            />
        </div>
    )
}
