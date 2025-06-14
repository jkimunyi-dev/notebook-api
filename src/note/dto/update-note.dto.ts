import { IsOptional, IsString, MaxLength, MinLength } from "class-validator/types/decorator/decorators";

export class UpdateNoteDTO {

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;
}
 