import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator'
import { ItemType } from '@prisma/client'

export class UpdateItemDto {
    @IsOptional() @IsString() title?: string
    @IsOptional() @IsString() url?: string
    @IsOptional() @IsEnum(ItemType) type?: ItemType
    @IsOptional() @IsString() parentId?: string // move to new parent
    @IsOptional() @IsInt() @Min(1) order?: number // 1-based index
}
