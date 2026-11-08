
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';
import { Film } from './interfaces/films.interface.js';

@Injectable()
export class FilmsService {
  private readonly films: Film[] = JSON.parse(
    readFileSync(join(process.cwd(), 'src', 'films.json'), 'utf8'),
  ) as Film[];

  constructor() {
    console.log('Data awal films.json:', this.films);
  }

  findAll(ditonton?: string): Film[] {
    if (ditonton === undefined) {
      return this.films;
    }

    if (ditonton !== 'true' && ditonton !== 'false') {
      throw new BadRequestException(
        'Query ditonton harus true atau false',
      );
    }

    return this.films.filter(
      (film) => film.sudahDitonton === (ditonton === 'true'),
    );
  }

  findOne(id: string): Film {
    const film = this.films.find((item) => item.id === id);

    if (!film) {
      throw new NotFoundException('Film tidak ditemukan');
    }

    return film;
  }

  create(dto: CreateFilmDto): Film {
    const filmBaru: Film = {
      ...dto,
      id: randomUUID(),
      sudahDitonton: dto.sudahDitonton ?? false,
    };

    this.films.push(filmBaru);
    return filmBaru;
  }

  update(id: string, dto: UpdateFilmDto): Film {
    const film = this.findOne(id);
    Object.assign(film, dto);
    return film;
  }

  remove(id: string): void {
    const index = this.films.findIndex(
      (film) => film.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Film tidak ditemukan');
    }

    this.films.splice(index, 1);
  }
}
