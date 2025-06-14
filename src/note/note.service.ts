import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Note } from './interface/note.interface';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateNoteDTO } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllNotes(): Promise<Note[]> {
    const query = `
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      ORDER BY created_at DESC
    `;
    
    const result = await this.databaseService.query(query);
    return result.rows;
  }

  async getNoteByTitle(title: string): Promise<Note[]> {
    const query = `
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      WHERE title = $1 
      ORDER BY created_at DESC
    `;
    
    const result = await this.databaseService.query(query, [title]);
    return result.rows;
  }

  async getNoteById(id: string): Promise<Note> {
    const query = `
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      WHERE id = $1
    `;
    
    const result = await this.databaseService.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    
    return result.rows[0];
  }

  async createNote(createNoteDTO: CreateNoteDTO): Promise<Note> {
    const query = `
      INSERT INTO notes (title, content) 
      VALUES ($1, $2) 
      RETURNING id, title, content, created_at, updated_at
    `;
    
    const result = await this.databaseService.query(query, [
      createNoteDTO.title,
      createNoteDTO.content,
    ]);
    
    return result.rows[0];
  }

  async updateNote(id: string, updateNoteDTO: UpdateNoteDTO): Promise<Note> {
    // First check if note exists
    await this.getNoteById(id);
    
    const updateFields = [];
    const values = [];
    let paramCounter = 1;

    if (updateNoteDTO.title !== undefined) {
      updateFields.push(`title = $${paramCounter}`);
      values.push(updateNoteDTO.title);
      paramCounter++;
    }

    if (updateNoteDTO.content !== undefined) {
      updateFields.push(`content = $${paramCounter}`);
      values.push(updateNoteDTO.content);
      paramCounter++;
    }

    if (updateFields.length === 0) {
      return await this.getNoteById(id);
    }

    values.push(id);
    
    const query = `
      UPDATE notes 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCounter}
      RETURNING id, title, content, created_at, updated_at
    `;
    
    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async deleteNote(id: string): Promise<void> {
    const query = `DELETE FROM notes WHERE id = $1`;
    
    const result = await this.databaseService.query(query, [id]);
    
    if (result.rowCount === 0) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }

  async searchNotes(searchTerm: string): Promise<Note[]> {
    const query = `
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      WHERE title ILIKE $1 OR content ILIKE $1 
      ORDER BY created_at DESC
    `;
    
    const result = await this.databaseService.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  async getNotesByDateRange(startDate: Date, endDate: Date): Promise<Note[]> {
    const query = `
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      WHERE created_at BETWEEN $1 AND $2 
      ORDER BY created_at DESC
    `;
    
    const result = await this.databaseService.query(query, [startDate, endDate]);
    return result.rows;
  }

  // Additional stored procedure-like queries
  async getNotesCount(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM notes`;
    const result = await this.databaseService.query(query);
    return parseInt(result.rows[0].count);
  }

  async getRecentNotes(limit: number = 5): Promise<Note[]> {
    const query = `
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    
    const result = await this.databaseService.query(query, [limit]);
    return result.rows;
  }

  async bulkDeleteNotes(ids: string[]): Promise<number> {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    const query = `DELETE FROM notes WHERE id IN (${placeholders})`;
    
    const result = await this.databaseService.query(query, ids);
    return result.rowCount;
  }
}
