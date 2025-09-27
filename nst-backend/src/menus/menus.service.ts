import { PrismaService } from '../prisma/prisma.service'
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common'
import {
    CreateMenuDto,
    CreateItemDto,
    UpdateItemDto,
    UpdateMenuDto,
    SaveMenuDto,
} from './dto'
import { buildTree } from './entities/tree.util'

@Injectable()
export class MenusService {
    constructor(private prisma: PrismaService) {}

    async createMenu(dto: CreateMenuDto) {
        return this.prisma.$transaction(async (tx) => {
            const menu = await tx.menu.create({
                data: { name: dto.name, slug: dto.slug },
            })
            const root = await tx.menuItem.create({
                data: {
                    menuId: menu.id,
                    parentId: null,
                    title: `${menu.name} Root`,
                    type: 'GROUP',
                    order: 1,
                },
            })
            return { menu, root }
        })
    }

    async listMenus(params: { status?: 'DRAFT' | 'PUBLISHED'; q?: string }) {
        return this.prisma.menu.findMany({
            where: {
                status: params.status,
                OR: params.q
                    ? [
                          { name: { contains: params.q, mode: 'insensitive' } },
                          { slug: { contains: params.q } },
                      ]
                    : undefined,
            },
            orderBy: { updatedAt: 'desc' },
        })
    }

    async getMenuBySlug(slug: string) {
        const menu = await this.prisma.menu.findUnique({ where: { slug } })
        if (!menu) throw new NotFoundException('Menu not found')
        return menu
    }

    async getMenuTree(slug: string) {
        const menu = await this.getMenuBySlug(slug)
        const items = await this.prisma.menuItem.findMany({
            where: { menuId: menu.id },
            orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
        })
        const normalized = items.map((i) => ({
            id: i.id,
            parentId: i.parentId,
            title: i.title,
            url: i.url ?? undefined,
            type: i.type,
            order: i.order,
            children: [],
        }))
        const root = buildTree(normalized)
        return { menu, root }
    }

    async addItem(slug: string, dto: CreateItemDto) {
        const menu = await this.getMenuBySlug(slug)
        const parent = await this.prisma.menuItem.findFirst({
            where: { id: dto.parentId, menuId: menu.id },
        })
        if (!parent) throw new NotFoundException('Parent item not found')
        const lastOrder = await this.prisma.menuItem.aggregate({
            where: { menuId: menu.id, parentId: parent.id },
            _max: { order: true },
        })
        const nextOrder = (lastOrder._max.order ?? 0) + 1
        return this.prisma.menuItem.create({
            data: {
                menuId: menu.id,
                parentId: parent.id,
                title: dto.title,
                url: dto.url,
                type: dto.type ?? 'LINK',
                order: nextOrder,
            },
        })
    }

    async updateItem(slug: string, itemId: string, dto: UpdateItemDto) {
        const menu = await this.getMenuBySlug(slug)
        const existing = await this.prisma.menuItem.findFirst({
            where: { id: itemId, menuId: menu.id },
        })
        if (!existing) throw new NotFoundException('Item not found')

        return this.prisma.$transaction(async (tx) => {
            let parentId = existing.parentId
            let order = existing.order

            // Move to new parent if provided
            if (dto.parentId && dto.parentId !== existing.parentId) {
                const newParent = await tx.menuItem.findFirst({
                    where: { id: dto.parentId, menuId: menu.id },
                })
                if (!newParent)
                    throw new NotFoundException('New parent not found')
                parentId = newParent.id
                const lastOrder = await tx.menuItem.aggregate({
                    where: { menuId: menu.id, parentId },
                    _max: { order: true },
                })
                order = (lastOrder._max.order ?? 0) + 1
            }

            // If explicit order provided, normalize sibling orders
            if (typeof dto.order === 'number') {
                if (!parentId)
                    throw new BadRequestException(
                        'Root order cannot be changed'
                    )
                const siblings = await tx.menuItem.findMany({
                    where: { menuId: menu.id, parentId },
                    orderBy: { order: 'asc' },
                })
                const maxOrder = siblings.length
                const targetOrder = Math.max(1, Math.min(dto.order, maxOrder))
                // Reassign sibling orders compactly
                const reordered = siblings
                    .filter((s) => s.id !== itemId)
                    .map((s, idx) => ({
                        id: s.id,
                        order: idx + 1 >= targetOrder ? idx + 2 : idx + 1,
                    }))
                // Apply sibling reorders
                await Promise.all(
                    reordered.map((s) =>
                        tx.menuItem.update({
                            where: { id: s.id },
                            data: { order: s.order },
                        })
                    )
                )
                order = targetOrder
            }

            return tx.menuItem.update({
                where: { id: itemId },
                data: {
                    title: dto.title,
                    url: dto.url,
                    type: dto.type,
                    parentId,
                    order,
                },
            })
        })
    }

    async deleteItem(slug: string, itemId: string) {
        const menu = await this.getMenuBySlug(slug)
        const item = await this.prisma.menuItem.findFirst({
            where: { id: itemId, menuId: menu.id },
        })
        if (!item) throw new NotFoundException('Item not found')
        // Deleting a root item is not allowed (delete menu instead)
        if (item.parentId === null)
            throw new BadRequestException('Cannot delete root item')
        return this.prisma.menuItem.delete({ where: { id: itemId } })
    }

    async updateMenu(slug: string, dto: UpdateMenuDto) {
        await this.getMenuBySlug(slug)
        return this.prisma.menu.update({ where: { slug }, data: dto })
    }

    async saveMenu(slug: string, dto: SaveMenuDto) {
        const menu = await this.getMenuBySlug(slug)
        if (dto.action === 'PUBLISH') {
            return this.prisma.menu.update({
                where: { slug },
                data: { status: 'PUBLISHED' },
            })
        }
        // For 'SAVE' action, just update the timestamp
        return this.prisma.menu.update({
            where: { slug },
            data: { updatedAt: new Date() },
        })
    }

    async deleteMenu(slug: string) {
        await this.getMenuBySlug(slug)
        return this.prisma.menu.delete({ where: { slug } })
    }
}
