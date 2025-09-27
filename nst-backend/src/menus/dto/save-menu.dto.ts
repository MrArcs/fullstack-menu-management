import { IsString } from 'class-validator'

export class SaveMenuDto {
    @IsString() action!: 'PUBLISH' | 'SAVE'
}
