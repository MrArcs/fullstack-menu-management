import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ItemType } from '@prisma/client'

export class CreateItemDto {
    @IsOptional() @IsString() parentId?: string | null // optional: null for root items
    @IsString() title!: string
    @IsOptional() @IsString() url?: string
    @IsOptional() @IsEnum(ItemType) type?: ItemType
}
