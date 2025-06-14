import { ApiProperty } from '@nestjs/swagger';

export class NoteResponseDTO {
  @ApiProperty({
    description: 'Unique identifier for the note',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the note',
    example: 'My First Note',
  })
  title: string;

  @ApiProperty({
    description: 'The content/body of the note',
    example: 'This is the content of my first note.',
  })
  content: string;

  @ApiProperty({
    description: 'When the note was created',
    example: '2025-06-14T10:30:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'When the note was last updated',
    example: '2025-06-14T15:45:00.000Z',
  })
  updated_at: Date;
}

export class NotesCountResponseDTO {
  @ApiProperty({
    description: 'Total number of notes',
    example: 42,
  })
  count: number;
}

export class BulkDeleteResponseDTO {
  @ApiProperty({
    description: 'Number of notes deleted',
    example: 3,
  })
  deletedCount: number;
}

export class BulkDeleteRequestDTO {
  @ApiProperty({
    description: 'Array of note IDs to delete',
    example: ['123e4567-e89b-12d3-a456-426614174000', '987fcdeb-51a2-43d1-b789-123456789abc'],
    type: [String],
  })
  ids: string[];
}