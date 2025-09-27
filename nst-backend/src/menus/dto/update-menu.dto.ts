import { IsOptional, IsString, IsEnum } from 'class-validator'
import { MenuStatus } from '@prisma/client'

export class UpdateMenuDto {
    @IsOptional() @IsString() name?: string
    @IsOptional() @IsEnum(MenuStatus) status?: MenuStatus
}
