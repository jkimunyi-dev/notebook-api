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
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDTO } from './dto/create-note.dto';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async getAllNotes() {
    return await this.noteService.getAllNotes();
  }

  @Get(':title')
  getNoteByTitle(@Query('title') title: string) {
    return this.noteService.getNoteByTitle(title);
  }

  @Get(':id')
  getNoteById(@Param('id') id: string) {
    return this.noteService.getNoteById(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createNote(@Body() createNoteDTO: CreateNoteDTO) {
    return this.noteService.createNote(createNoteDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteNote(@Param('id') id: string) {
    return this.noteService.deleteNote(id);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  updateNote(@Param('id') id: string, updateNoteDTO: CreateNoteDTO) {
    return this.noteService.updateNote({
      id,
      ...updateNoteDTO,
    });
  }
}
