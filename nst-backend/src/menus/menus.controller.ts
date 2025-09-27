import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common'
import { MenusService } from './menus.service'
import {
    CreateMenuDto,
    CreateItemDto,
    UpdateItemDto,
    UpdateMenuDto,
    SaveMenuDto,
} from './dto'

@Controller('api/v1/menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Post()
    createMenu(@Body() createMenuDto: CreateMenuDto) {
        return this.menusService.createMenu(createMenuDto)
    }

    @Get()
    listMenus(
        @Query('status') status?: 'DRAFT' | 'PUBLISHED',
        @Query('q') q?: string
    ) {
        return this.menusService.listMenus({ status, q })
    }

    @Get(':slug')
    getMenuBySlug(@Param('slug') slug: string) {
        return this.menusService.getMenuBySlug(slug)
    }

    @Get(':slug/tree')
    getMenuTree(@Param('slug') slug: string) {
        return this.menusService.getMenuTree(slug)
    }

    @Patch(':slug')
    updateMenu(
        @Param('slug') slug: string,
        @Body() updateMenuDto: UpdateMenuDto
    ) {
        return this.menusService.updateMenu(slug, updateMenuDto)
    }

    @Delete(':slug')
    deleteMenu(@Param('slug') slug: string) {
        return this.menusService.deleteMenu(slug)
    }

    @Post(':slug/items')
    addItem(@Param('slug') slug: string, @Body() createItemDto: CreateItemDto) {
        return this.menusService.addItem(slug, createItemDto)
    }

    @Patch(':slug/items/:itemId')
    updateItem(
        @Param('slug') slug: string,
        @Param('itemId') itemId: string,
        @Body() updateItemDto: UpdateItemDto
    ) {
        return this.menusService.updateItem(slug, itemId, updateItemDto)
    }

    @Delete(':slug/items/:itemId')
    deleteItem(@Param('slug') slug: string, @Param('itemId') itemId: string) {
        return this.menusService.deleteItem(slug, itemId)
    }

    @Post(':slug/save')
    saveMenu(@Param('slug') slug: string, @Body() saveMenuDto: SaveMenuDto) {
        return this.menusService.saveMenu(slug, saveMenuDto)
    }
}
