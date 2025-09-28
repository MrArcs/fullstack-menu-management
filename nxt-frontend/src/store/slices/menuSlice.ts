import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '../../lib/api'

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

export interface Menu {
    id: string
    name: string
    slug: string
    status: 'DRAFT' | 'PUBLISHED'
    createdAt: string
    updatedAt: string
}

export interface MenuState {
    menus: Menu[]
    currentMenu: Menu | null
    currentTree: MenuItem | null
    selectedItem: MenuItem | null
    loading: boolean
    error: string | null
    treeExpanded: boolean
}

const initialState: MenuState = {
    menus: [],
    currentMenu: null,
    currentTree: null,
    selectedItem: null,
    loading: false,
    error: null,
    treeExpanded: true,
}

// Async thunks
export const fetchMenus = createAsyncThunk(
    'menu/fetchMenus',
    async (params?: { status?: string; q?: string }) => {
        console.log('Fetching menus with params:', params)
        const result = await apiClient.getMenus(params)
        console.log('Menus fetched:', result)
        return result
    }
)

export const fetchMenuTree = createAsyncThunk(
    'menu/fetchMenuTree',
    async (slug: string) => {
        console.log('Fetching menu tree for slug:', slug)
        const result = await apiClient.getMenuTree(slug)
        console.log('Menu tree fetched:', result)
        return result
    }
)

export const createMenu = createAsyncThunk(
    'menu/createMenu',
    async (data: { name: string; slug: string }) => {
        return await apiClient.createMenu(data)
    }
)

export const updateItem = createAsyncThunk(
    'menu/updateItem',
    async ({
        slug,
        itemId,
        data,
    }: {
        slug: string
        itemId: string
        data: {
            title?: string
            url?: string
            type?: 'LINK' | 'GROUP' | 'SEPARATOR'
            parentId?: string
            order?: number
        }
    }) => {
        return await apiClient.updateItem(slug, itemId, data)
    }
)

export const addItem = createAsyncThunk(
    'menu/addItem',
    async ({
        slug,
        data,
    }: {
        slug: string
        data: {
            parentId: string | null
            title: string
            url?: string
            type?: 'LINK' | 'GROUP' | 'SEPARATOR'
        }
    }) => {
        return await apiClient.addItem(slug, data)
    }
)

export const deleteItem = createAsyncThunk(
    'menu/deleteItem',
    async ({ slug, itemId }: { slug: string; itemId: string }) => {
        await apiClient.deleteItem(slug, itemId)
        return itemId
    }
)

export const deleteMenu = createAsyncThunk(
    'menu/deleteMenu',
    async (slug: string) => {
        await apiClient.deleteMenu(slug)
        return slug
    }
)

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setCurrentMenu: (state, action: PayloadAction<Menu | null>) => {
            state.currentMenu = action.payload
        },
        setSelectedItem: (state, action: PayloadAction<MenuItem | null>) => {
            state.selectedItem = action.payload
        },
        toggleTreeExpanded: (state) => {
            state.treeExpanded = !state.treeExpanded
        },
        toggleItemExpanded: (state, action: PayloadAction<string>) => {
            const toggleExpanded = (items: MenuItem[]): MenuItem[] => {
                return items.map((item) => ({
                    ...item,
                    expanded:
                        item.id === action.payload
                            ? !item.expanded
                            : item.expanded,
                    children: toggleExpanded(item.children || []),
                }))
            }
            if (state.currentTree) {
                state.currentTree = {
                    ...state.currentTree,
                    children: toggleExpanded(state.currentTree.children || []),
                }
            }
        },
        expandAllItems: (state) => {
            const expandAll = (items: MenuItem[]): MenuItem[] => {
                return items.map((item) => ({
                    ...item,
                    expanded: true,
                    children: expandAll(item.children || []),
                }))
            }
            if (state.currentTree) {
                state.currentTree = {
                    ...state.currentTree,
                    children: expandAll(state.currentTree.children || []),
                }
            }
        },
        collapseAllItems: (state) => {
            const collapseAll = (items: MenuItem[]): MenuItem[] => {
                return items.map((item) => ({
                    ...item,
                    expanded: false,
                    children: collapseAll(item.children || []),
                }))
            }
            if (state.currentTree) {
                state.currentTree = {
                    ...state.currentTree,
                    children: collapseAll(state.currentTree.children || []),
                }
            }
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch menus
            .addCase(fetchMenus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMenus.fulfilled, (state, action) => {
                state.loading = false
                state.menus = action.payload
            })
            .addCase(fetchMenus.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch menus'
            })
            // Fetch menu tree
            .addCase(fetchMenuTree.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMenuTree.fulfilled, (state, action) => {
                state.loading = false
                state.currentMenu = action.payload.menu
                state.currentTree = action.payload.root
            })
            .addCase(fetchMenuTree.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Failed to fetch menu tree'
            })
            // Create menu
            .addCase(createMenu.fulfilled, (state, action) => {
                state.menus.push(action.payload.menu)
                state.currentMenu = action.payload.menu
                // Create a tree structure with the root item
                state.currentTree = {
                    id: 'virtual-root',
                    parentId: null,
                    title: 'Root',
                    url: null,
                    type: 'GROUP',
                    order: 0,
                    children: [action.payload.rootItem],
                }
            })
            // Update item
            .addCase(updateItem.fulfilled, (state, action) => {
                // Update the tree with the modified item
                const updateItemInTree = (items: MenuItem[]): MenuItem[] => {
                    return items.map((item) => {
                        if (item.id === action.payload.id) {
                            return {
                                ...action.payload,
                                children: item.children || [],
                            }
                        }
                        return {
                            ...item,
                            children: updateItemInTree(item.children || []),
                        }
                    })
                }
                if (state.currentTree) {
                    state.currentTree = {
                        ...state.currentTree,
                        children: updateItemInTree(state.currentTree.children),
                    }
                }
                if (state.selectedItem?.id === action.payload.id) {
                    state.selectedItem = action.payload
                }
            })
            // Add item
            .addCase(addItem.fulfilled, (state, action) => {
                // Handle root items (parentId is null)
                if (!action.payload.parentId) {
                    if (state.currentTree) {
                        state.currentTree = {
                            ...state.currentTree,
                            children: [
                                ...(state.currentTree.children || []),
                                action.payload,
                            ],
                        }
                    }
                    return
                }

                // Handle child items (parentId is provided)
                const addItemToTree = (
                    items: MenuItem[],
                    parentId: string
                ): MenuItem[] => {
                    return items.map((item) => {
                        if (item.id === parentId) {
                            return {
                                ...item,
                                children: [
                                    ...(item.children || []),
                                    action.payload,
                                ],
                            }
                        }
                        return {
                            ...item,
                            children: addItemToTree(
                                item.children || [],
                                parentId
                            ),
                        }
                    })
                }
                if (state.currentTree) {
                    state.currentTree = {
                        ...state.currentTree,
                        children: addItemToTree(
                            state.currentTree.children,
                            action.payload.parentId
                        ),
                    }
                }
            })
            // Delete item
            .addCase(deleteItem.fulfilled, (state, action) => {
                // Remove the item from the tree
                const removeItemFromTree = (items: MenuItem[]): MenuItem[] => {
                    return items
                        .filter((item) => item.id !== action.payload)
                        .map((item) => ({
                            ...item,
                            children: removeItemFromTree(item.children || []),
                        }))
                }
                if (state.currentTree) {
                    state.currentTree = {
                        ...state.currentTree,
                        children: removeItemFromTree(
                            state.currentTree.children
                        ),
                    }
                }
                if (state.selectedItem?.id === action.payload) {
                    state.selectedItem = null
                }
            })
            // Delete menu
            .addCase(deleteMenu.fulfilled, (state, action) => {
                // Remove the menu from the list
                state.menus = state.menus.filter(
                    (menu) => menu.slug !== action.payload
                )
                // If the deleted menu was the current menu, clear it
                if (state.currentMenu?.slug === action.payload) {
                    state.currentMenu = null
                    state.currentTree = null
                    state.selectedItem = null
                }
            })
    },
})

export const {
    setCurrentMenu,
    setSelectedItem,
    toggleTreeExpanded,
    toggleItemExpanded,
    expandAllItems,
    collapseAllItems,
    clearError,
} = menuSlice.actions

export default menuSlice.reducer
