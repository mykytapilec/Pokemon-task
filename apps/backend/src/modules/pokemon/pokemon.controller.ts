import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly service: PokemonService) {}

  @Get()
  getPokemonList(@Query('limit') limit = 20, @Query('offset') offset = 0) {
    return this.service.getPokemonList(Number(limit), Number(offset));
  }

  @Get(':name')
  getPokemon(@Param('name') name: string) {
    return this.service.getPokemon(name);
  }
}
