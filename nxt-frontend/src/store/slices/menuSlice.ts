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
        return await apiClient.getMenus(params)
    }
)

export const fetchMenuTree = createAsyncThunk(
    'menu/fetchMenuTree',
    async (slug: string) => {
        return await apiClient.getMenuTree(slug)
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
            parentId: string
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
                    children: toggleExpanded(item.children),
                }))
            }
            if (state.currentTree) {
                state.currentTree = {
                    ...state.currentTree,
                    children: toggleExpanded(state.currentTree.children),
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
                state.currentTree = action.payload.root
            })
            // Update item
            .addCase(updateItem.fulfilled, (state, action) => {
                // Update the tree with the modified item
                const updateItemInTree = (items: MenuItem[]): MenuItem[] => {
                    return items.map((item) => {
                        if (item.id === action.payload.id) {
                            return {
                                ...action.payload,
                                children: item.children,
                            }
                        }
                        return {
                            ...item,
                            children: updateItemInTree(item.children),
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
                // Add the new item to the tree
                const addItemToTree = (
                    items: MenuItem[],
                    parentId: string
                ): MenuItem[] => {
                    return items.map((item) => {
                        if (item.id === parentId) {
                            return {
                                ...item,
                                children: [...item.children, action.payload],
                            }
                        }
                        return {
                            ...item,
                            children: addItemToTree(item.children, parentId),
                        }
                    })
                }
                if (state.currentTree) {
                    state.currentTree = {
                        ...state.currentTree,
                        children: addItemToTree(
                            state.currentTree.children,
                            action.payload.parentId || ''
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
                            children: removeItemFromTree(item.children),
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
    },
})

export const {
    setCurrentMenu,
    setSelectedItem,
    toggleTreeExpanded,
    toggleItemExpanded,
    clearError,
} = menuSlice.actions

export default menuSlice.reducer
