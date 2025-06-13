import { Injectable, NotFoundException } from '@nestjs/common';
import { Note } from './interface/note.interface';
import { CreateNoteDTO } from './dto/create-note.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class NoteService {
  private notes: Note[] = [];

  async getAllNotes(): Promise<Note[]> {
    return await this.notes;
  }

  async getNoteByTitle(title: string): Promise<Note | undefined> {
    return this.notes.find((note) => note.title === title);
  }

  async getNoteById(id: string): Promise<Note | undefined> {
    return await this.notes.find((note) => note.id === id);
  }

  async createNote(createNoteDTO: CreateNoteDTO): Promise<Note> {
    const newNote: Note = {
      id: randomUUID(),
      title: createNoteDTO.title,
      content: createNoteDTO.content,
      createdAt: new Date(),
    };

    this.notes.push(newNote);

    return newNote;
  }

  async updateNote(createNoteDTO: CreateNoteDTO): Promise<Note> {
    const noteIndex = this.notes.findIndex(
      (note) => note.id === createNoteDTO.id,
    );

    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    const updateNote: Note = await {
      id: randomUUID(),
      title: createNoteDTO.title,
      content: createNoteDTO.content,
      createdAt: new Date(),
    };

    this.notes[noteIndex] = updateNote;
    return updateNote;
  }

  async deleteNote(id: string): Promise<void> {
    const noteIndex = await this.notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      throw new NotFoundException(`Note with the id : ${id} not found`);
    }
  }
}
