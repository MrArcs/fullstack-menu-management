import { IsString, Matches } from 'class-validator'

export class CreateMenuDto {
    @IsString() name!: string
    @IsString()
    @Matches(/^[a-z0-9-]+$/)
    slug!: string
}
