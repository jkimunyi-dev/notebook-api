import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  Delete,
  Patch,
  Body,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { NoteService } from './note.service';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateNoteDTO } from './dto/update-note.dto';
import {
  NoteResponseDTO,
  NotesCountResponseDTO,
  BulkDeleteResponseDTO,
  BulkDeleteRequestDTO,
} from './dto/note-response.dto';

@ApiTags('notes')
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all notes',
    description: 'Retrieve all notes ordered by creation date (newest first)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all notes retrieved successfully',
    type: [NoteResponseDTO],
  })
  async getAllNotes() {
    return await this.noteService.getAllNotes();
  }

  @Get('count')
  @ApiOperation({
    summary: 'Get total notes count',
    description: 'Get the total number of notes in the database',
  })
  @ApiResponse({
    status: 200,
    description: 'Total notes count retrieved successfully',
    type: NotesCountResponseDTO,
  })
  async getNotesCount() {
    const count = await this.noteService.getNotesCount();
    return { count };
  }

  @Get('recent')
  @ApiOperation({
    summary: 'Get recent notes',
    description: 'Get the most recently created notes with optional limit',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of recent notes to retrieve',
    example: 5,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Recent notes retrieved successfully',
    type: [NoteResponseDTO],
  })
  async getRecentNotes(@Query('limit', ParseIntPipe) limit: number = 5) {
    return await this.noteService.getRecentNotes(limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search notes',
    description: 'Search notes by title or content using case-insensitive matching',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search term to look for in title or content',
    example: 'meeting notes',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: [NoteResponseDTO],
  })
  async searchNotes(@Query('q') searchTerm: string) {
    if (!searchTerm) {
      return await this.noteService.getAllNotes();
    }
    return await this.noteService.searchNotes(searchTerm);
  }

  @Get('by-title')
  @ApiOperation({
    summary: 'Get notes by exact title',
    description: 'Retrieve notes that match the exact title provided',
  })
  @ApiQuery({
    name: 'title',
    required: true,
    description: 'Exact title to search for',
    example: 'My Important Note',
  })
  @ApiResponse({
    status: 200,
    description: 'Notes with matching title retrieved successfully',
    type: [NoteResponseDTO],
  })
  async getNoteByTitle(@Query('title') title: string) {
    return await this.noteService.getNoteByTitle(title);
  }

  @Get('date-range')
  @ApiOperation({
    summary: 'Get notes by date range',
    description: 'Retrieve notes created within a specific date range',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date for the range (ISO 8601 format)',
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date for the range (ISO 8601 format)',
    example: '2025-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Notes in date range retrieved successfully',
    type: [NoteResponseDTO],
  })
  async getNotesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.noteService.getNotesByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get note by ID',
    description: 'Retrieve a specific note by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the note',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Note retrieved successfully',
    type: NoteResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Note not found',
  })
  async getNoteById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.noteService.getNoteById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new note',
    description: 'Create a new note with title and content',
  })
  @ApiBody({
    type: CreateNoteDTO,
    description: 'Note data to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Note created successfully',
    type: NoteResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async createNote(@Body() createNoteDTO: CreateNoteDTO) {
    return await this.noteService.createNote(createNoteDTO);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bulk delete notes',
    description: 'Delete multiple notes by providing their IDs',
  })
  @ApiBody({
    type: BulkDeleteRequestDTO,
    description: 'Array of note IDs to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Notes deleted successfully',
    type: BulkDeleteResponseDTO,
  })
  async bulkDeleteNotes(@Body('ids') ids: string[]) {
    const deletedCount = await this.noteService.bulkDeleteNotes(ids);
    return { deletedCount };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a note',
    description: 'Update an existing note by its ID. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the note to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateNoteDTO,
    description: 'Note data to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Note updated successfully',
    type: NoteResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Note not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async updateNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNoteDTO: UpdateNoteDTO,
  ) {
    return await this.noteService.updateNote(id, updateNoteDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a note',
    description: 'Delete a specific note by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the note to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Note deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Note not found',
  })
  async deleteNote(@Param('id', ParseUUIDPipe) id: string) {
    await this.noteService.deleteNote(id);
  }
}