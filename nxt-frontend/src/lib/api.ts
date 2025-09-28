const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export interface Menu {
    id: string
    name: string
    slug: string
    status: 'DRAFT' | 'PUBLISHED'
    createdAt: string
    updatedAt: string
}

export interface MenuItem {
    id: string
    parentId: string | null
    title: string
    url?: string | null
    type: 'LINK' | 'GROUP' | 'SEPARATOR'
    order: number
    children: MenuItem[]
}

export interface CreateMenuRequest {
    name: string
    slug: string
}

export interface CreateItemRequest {
    parentId: string | null
    title: string
    url?: string
    type?: 'LINK' | 'GROUP' | 'SEPARATOR'
}

export interface UpdateItemRequest {
    title?: string
    url?: string
    type?: 'LINK' | 'GROUP' | 'SEPARATOR'
    parentId?: string
    order?: number
}

export interface UpdateMenuRequest {
    name?: string
    status?: 'DRAFT' | 'PUBLISHED'
}

export interface SaveMenuRequest {
    action: 'PUBLISH' | 'SAVE'
}

class ApiClient {
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
        console.log('API Client initialized with base URL:', baseUrl)
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`
        console.log('API Request:', { url, options })

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        })

        console.log('API Response:', {
            status: response.status,
            ok: response.ok,
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error:', errorText)
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('API Result:', result)
        return result
    }

    // Menu endpoints
    async createMenu(data: CreateMenuRequest) {
        return this.request<{ menu: Menu; rootItem: MenuItem }>('/menus', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async getMenus(params?: { status?: string; q?: string }) {
        const searchParams = new URLSearchParams()
        if (params?.status) searchParams.append('status', params.status)
        if (params?.q) searchParams.append('q', params.q)

        const query = searchParams.toString()
        return this.request<Menu[]>(`/menus${query ? `?${query}` : ''}`)
    }

    async getMenu(slug: string) {
        return this.request<Menu>(`/menus/${slug}`)
    }

    async getMenuTree(slug: string) {
        return this.request<{ menu: Menu; root: MenuItem }>(
            `/menus/${slug}/tree`
        )
    }

    async updateMenu(slug: string, data: UpdateMenuRequest) {
        return this.request<Menu>(`/menus/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    }

    async deleteMenu(slug: string) {
        return this.request<void>(`/menus/${slug}`, {
            method: 'DELETE',
        })
    }

    // Menu item endpoints
    async addItem(slug: string, data: CreateItemRequest) {
        return this.request<MenuItem>(`/menus/${slug}/items`, {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async updateItem(slug: string, itemId: string, data: UpdateItemRequest) {
        return this.request<MenuItem>(`/menus/${slug}/items/${itemId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    }

    async deleteItem(slug: string, itemId: string) {
        return this.request<void>(`/menus/${slug}/items/${itemId}`, {
            method: 'DELETE',
        })
    }

    async saveMenu(slug: string, data: SaveMenuRequest) {
        return this.request<Menu>(`/menus/${slug}/save`, {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }
}

export const apiClient = new ApiClient(API_BASE_URL)
