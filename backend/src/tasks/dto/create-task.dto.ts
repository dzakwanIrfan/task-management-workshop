import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    title!: string; 

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string
}