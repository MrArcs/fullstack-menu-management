import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ItemType } from '@prisma/client'

export class CreateItemDto {
    @IsString() parentId!: string // required: lower layer add
    @IsString() title!: string
    @IsOptional() @IsString() url?: string
    @IsOptional() @IsEnum(ItemType) type?: ItemType
}
