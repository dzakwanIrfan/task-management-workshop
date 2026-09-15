import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    @MaxLength(120)
    title?: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}