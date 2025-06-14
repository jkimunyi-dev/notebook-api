import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateNoteDTO {
  @ApiProperty({
    description: 'The title of the note',
    example: 'My First Note',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'The content/body of the note',
    example: 'This is the content of my first note. It can contain any text.',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;
}
